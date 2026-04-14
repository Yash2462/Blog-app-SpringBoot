package com.blog_app.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.blog_app.config.JwtProvider;
import com.blog_app.constant.AppConstants;
import com.blog_app.entity.User;
import com.blog_app.response.ResponseMessageVo;
import com.blog_app.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping(AppConstants.API)
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Get currently authenticated user's profile from JWT token.
     */
    @GetMapping("/users/me")
    public ResponseEntity<Object> getCurrentUser(HttpServletRequest request) {
        ResponseMessageVo response = new ResponseMessageVo();
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.setMessage("No valid Authorization header");
                response.setStatus(401);
                return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
            }
            String email = JwtProvider.getEmailFromToken(authHeader);
            User user = userService.findUserByEmail(email);
            if (user == null) {
                response.setMessage("User not found");
                response.setStatus(404);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            response.setMessage("User retrieved successfully");
            response.setStatus(200);
            response.setData(user);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setMessage("Error retrieving current user");
            response.setStatus(500);
            response.setData(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get all users — restricted to ADMIN only.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<Object> getAllUsers() {
        ResponseMessageVo response = new ResponseMessageVo();
        try {
            List<User> users = userService.findAllUsers();
            response.setMessage("Users retrieved successfully");
            response.setStatus(200);
            response.setData(users);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setMessage("Error retrieving users");
            response.setStatus(500);
            response.setData(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Delete a user — restricted to ADMIN only.
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Object> deleteUserById(@PathVariable Long userId) {
        ResponseMessageVo response = new ResponseMessageVo();
        try {
            userService.deleteUser(userId);
            response.setMessage("User deleted successfully");
            response.setStatus(200);
            response.setData("");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setMessage("Error deleting user");
            response.setStatus(500);
            response.setData(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update a user's profile. Only the account owner (or an ADMIN) may update.
     * Password is re-encoded before persisting.
     */
    @PutMapping("/users/{userId}")
    public ResponseEntity<Object> update(@RequestBody User user, @PathVariable Long userId,
                                         HttpServletRequest request) {
        ResponseMessageVo response = new ResponseMessageVo();

        // Authorization: requester must match userId or be an admin
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.setMessage("Missing or invalid Authorization header");
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }
            String email = JwtProvider.getEmailFromToken(authHeader);
            User requestingUser = userService.findUserByEmail(email);
            boolean isAdmin = request.isUserInRole("ROLE_ADMIN");
            if (requestingUser == null || (!requestingUser.getId().equals(userId) && !isAdmin)) {
                response.setMessage("You are not authorized to update this user's profile");
                response.setStatus(HttpStatus.FORBIDDEN.value());
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }
        } catch (Exception e) {
            response.setMessage("Authorization check failed");
            response.setStatus(HttpStatus.FORBIDDEN.value());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        User updateUser = userService.findUserById(userId);
        if (updateUser == null) {
            response.setMessage("User not found");
            response.setStatus(HttpStatus.NOT_FOUND.value());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        try {
            if (user.getEmail() != null && !user.getEmail().isBlank()) {
                updateUser.setEmail(user.getEmail());
            }
            if (user.getUsername() != null && !user.getUsername().isBlank()) {
                updateUser.setUsername(user.getUsername());
            }
            // Password must be re-encoded before storing
            if (user.getPassword() != null && !user.getPassword().isBlank()) {
                updateUser.setPassword(passwordEncoder.encode(user.getPassword()));
            }

            User saved = userService.saveUser(updateUser);

            // Never expose the password hash in the response
            saved.setPassword(null);

            response.setMessage("User updated successfully");
            response.setStatus(HttpStatus.OK.value());
            response.setData(saved);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.setMessage("Error updating user");
            response.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());
            response.setData(e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<Object> getUserById(@PathVariable Long userId) {
        ResponseMessageVo response = new ResponseMessageVo();
        try {
            User user = userService.findUserById(userId);
            response.setMessage("User found successfully");
            response.setStatus(200);
            response.setData(user);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setMessage("User not found");
            response.setStatus(404);
            response.setData(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/users/getByMail")
    public ResponseEntity<Object> getUserByEmail(@RequestParam String email) {
        ResponseMessageVo response = new ResponseMessageVo();
        try {
            User user = userService.findUserByEmail(email);
            response.setMessage("User found successfully");
            response.setStatus(200);
            response.setData(user);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            response.setMessage("Error finding user");
            response.setStatus(500);
            response.setData(e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
