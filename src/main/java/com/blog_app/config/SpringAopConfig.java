package com.blog_app.config;

import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class SpringAopConfig {

	private static final Logger logger = LoggerFactory.getLogger(SpringAopConfig.class);
	
    // Pointcut for all methods in REST controllers
    @Before("execution(* com.blog_app.controller.*.*(..))")
    public void logBefore() {
        logger.info("API call received...");
    }
    
    // Logging response after a method finishes execution
    @AfterReturning(pointcut = "execution(* com.blog_app.controller.*.*(..))", returning = "result")
    public void logAfterReturning(Object result) {
        logger.info("API returned: " + result);
    }
}
