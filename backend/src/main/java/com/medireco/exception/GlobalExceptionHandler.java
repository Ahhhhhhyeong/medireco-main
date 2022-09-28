package com.medireco.exception;

import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(Exception.class)
	public String handlerException(HttpServletResponse response, Exception e) throws Exception {
		if (e instanceof NoHandlerFoundException) {
			return "index";
		}
		return "";
	}
}
