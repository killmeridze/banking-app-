package com.bankist.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.bankist.annotations.LogController;
import com.bankist.annotations.LogService;
import com.bankist.annotations.LogRepository;

@Aspect // Annotation indicating that this class is an aspect for AOP (Aspect-Oriented Programming)
@Component // Declares this class as a Spring component
public class LoggingAspect {
    private static final Logger logger = LoggerFactory.getLogger(LoggingAspect.class);

    // Method for logging all methods annotated with @LogController
    @Around("@within(logController) || @annotation(logController)")
    public Object logController(ProceedingJoinPoint joinPoint, LogController logController) throws Throwable {
        return log(joinPoint, "Controller");
    }

    // Method for logging all methods annotated with @LogService
    @Around("@within(logService) || @annotation(logService)")
    public Object logService(ProceedingJoinPoint joinPoint, LogService logService) throws Throwable {
        return log(joinPoint, "Service");
    }

    // Method for logging all methods annotated with @LogRepository
    @Around("@within(logRepository) || @annotation(logRepository)")
    public Object logRepository(ProceedingJoinPoint joinPoint, LogRepository logRepository) throws Throwable {
        return log(joinPoint, "Repository");
    }

    // Core logging method
    private Object log(ProceedingJoinPoint joinPoint, String layer) throws Throwable {
        String methodName = joinPoint.getSignature().toShortString();
        logger.info("{} - Before invocation: {}", layer, methodName);
        Object result;
        try {
            result = joinPoint.proceed(); // Execute the method
            logger.info("{} - After invocation: {}", layer, methodName);
        } catch (Throwable throwable) {
            logger.error("{} - Exception in: {}", layer, methodName, throwable);
            throw throwable; // Rethrow the exception
        }
        return result;
    }
}