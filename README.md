# Blog Application REST API

Welcome to the Blog Application REST API project! This application is a simple blog management system built using Spring Boot. It allows users to create, read, update, and delete blog posts via a RESTful API.

## Features

- **CRUD Operations**: Create, Read, Update, and Delete blog posts.
- **User Management**: Register and authenticate users.
- **Tag Management**: Add and manage tags for blog posts.
- **Search**: Search blog posts by title and tags.

## Technologies Used

- **Spring Boot**: For building the RESTful API.
- **Spring Data JPA**: For database interactions.
- **H2 Database**: In-memory database for development and testing.
- **Spring Security**: For authentication and authorization.
- **Maven**: For project build and dependency management.
- **JUnit**: For testing.

## Getting Started

### Prerequisites

- Java 11 or higher
- Maven 3.6 or higher

### Clone the Repository

```bash
git clone https://github.com/Yash2462/Blog-app-SpringBoot.git
cd blog-application

### Build the Project
```bash
mvn clean install

### Run the Application
```bash
mvn spring-boot:run

### Run on docker to test Api's

1. go to the root directory of project

2. run  docker-compose up (prerequisite docker desktop installed and running if you are using windows or mac)

3. access endpoints on port 8080


-- happy coding ✌😉
