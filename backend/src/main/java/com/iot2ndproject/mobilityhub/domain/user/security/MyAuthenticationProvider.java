package com.iot2ndproject.mobilityhub.domain.user.security;

import com.iot2ndproject.mobilityhub.domain.user.dto.UserUserDetail;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;


@RequiredArgsConstructor
public class MyAuthenticationProvider implements AuthenticationProvider {
    private final PasswordEncoder passwordEncoder;
    private final UserSecurityDetailService detailService;
    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String id = authentication.getName();
        String pass = authentication.getCredentials().toString();
        UserDetails userDetails = (UserDetails) detailService.loadUserByUsername(id);

        boolean state = false;
        UsernamePasswordAuthenticationToken authenticationToken = null;
        if(userDetails!=null){
            state = passwordEncoder.matches(pass, userDetails.getPassword());
            if(state){
                authenticationToken = new UsernamePasswordAuthenticationToken(((UserUserDetail) userDetails).getResponseDTO(),null, userDetails.getAuthorities());
            }
        }


        return authenticationToken;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}
