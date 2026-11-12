package com.gpc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(
            IllegalArgumentException.class)
    public ResponseEntity<String> tratarArgumento(
            IllegalArgumentException erro) {

        return ResponseEntity
                .badRequest()
                .body(erro.getMessage());
    }

    @ExceptionHandler(
            IllegalStateException.class)
    public ResponseEntity<String> tratarEstado(
            IllegalStateException erro) {

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(erro.getMessage());
    }
}