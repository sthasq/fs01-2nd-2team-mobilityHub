package com.iot2ndproject.mobilityhub.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.io.IOException;

//필터는 서블릿이 실행되기 전에 실행되는 컴포넌트
//여러 개의 필터를 연결할 수 있고 각 컨트롤러마다 실행되는 필터의 목록을 다르게 조절하는 것이 가능
//실행해야 하는 필터 목록을 객체로 표현한 것이 FillterChain
//필터는 요청으로 들어가면서 실행되고 컨트롤러까지 모두 실행이 완료된 후 응답으로 나오면서 실행되도록 할 수 있다.
//요청 -> 필터 -> 서블릿
// 서블릿 -> 필터 -> 응답

//@Component
public class MyCustomFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        //
        HttpServletRequest httpServletRequest = (HttpServletRequest) request;
        String requestURI = httpServletRequest.getRequestURI();
        System.out.println(">>>요청들어감>> 요청한 uri: "+requestURI);
        //필터 체인에 등록되어 있는 다음 필터가 실행(실행될 필터가 없으면 서블릿이 실행)
        long startTime = System.currentTimeMillis();
        chain.doFilter(request,response);
        //응답되면서 실행되는 부분 - 요청 처리가 끝나고 클라이언트에게 응답하면서 실행될 코드가 있으면 명시
        long endTime = System.currentTimeMillis();
        System.out.println("<<<<<<<<<<응답 나감(실행시간): "+(endTime-startTime)+"ms");
    }
}

