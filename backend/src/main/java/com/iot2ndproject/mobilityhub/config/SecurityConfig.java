package com.iot2ndproject.mobilityhub.config;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

//@Configuration
//@EnableWebSecurity(debug = true)
public class SecurityConfig {

//    @Bean
    public PasswordEncoder passwordEncoder(){
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
//    @Bean
    public SecurityFilterChain chain(HttpSecurity http) throws Exception{
        http.csrf(csrf->csrf.disable())
                .authorizeHttpRequests(auth-> auth
//                        .requestMatchers("/customer/create").hasAnyRole("ADMIN")
                        .requestMatchers("product/**").hasAnyRole("USER","ADMIN")
                        .anyRequest().permitAll())

                .formLogin(Customizer.withDefaults());
        return http.build();

    }

//    @Bean
    public UserDetailsService userDetailsService(){
        UserDetails user =  User.withDefaultPasswordEncoder().password("1234").username("user").roles("USER").build();
        UserDetails admin = User.withDefaultPasswordEncoder().username("admin").password("1234").roles("ADMIN").build();
        return new InMemoryUserDetailsManager(user,admin);
    }
}
