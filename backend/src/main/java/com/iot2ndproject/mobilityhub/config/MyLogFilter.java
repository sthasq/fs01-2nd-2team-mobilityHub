package com.iot2ndproject.mobilityhub.config;

import jakarta.servlet.*;
import org.springframework.stereotype.Component;

import java.io.IOException;

//필터는 서블릿이 실행되기 전에 실행되는 컴포넌트
//여러 개의 필터를 연결할 수 있고 각 컨트롤러마다 실행되는 필터의 목록을 다르게 조절하는 것이 가능
//실행해야 하는 필터 목록을 객체로 표현한 것이 FillterChain
//필터는 요청으로 들어가면서 실행되고 컨트롤러까지 모두 실행이 완료된 후 응답으로 나오면서 실행되도록 할 수 있다.
//요청 -> 필터 -> 서블릿
// 서블릿 -> 필터 -> 응답

//@Component
public class MyLogFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        System.out.println("================================");
        chain.doFilter(request,response);

    }
}

