package com.hellofood.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity // (선택 사항이지만 명확성을 위해 추가)
public class SecurityConfig {

    // 1. PasswordEncoder 빈 등록 (Service에서 사용)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. Spring Security 필터 체인 설정
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CORS 활성화 및 설정 등록 (아래 corsConfigurationSource 빈 사용)
            .cors(Customizer.withDefaults()) 
            
            // API 서버이므로 HTTP Basic, CSRF 비활성화
            .httpBasic(AbstractHttpConfigurer::disable)
            .csrf(AbstractHttpConfigurer::disable)
            
            // 302 리다이렉션 방지를 위해 세션을 Stateless로 설정 (가장 중요)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 인가(Authorization) 설정
            .authorizeHttpRequests(auth -> auth
                // 모든 경로 인증 없이 허용 (개발용)
                .anyRequest().permitAll() 
            );

        return http.build();
    }

    // // 3. CORS 정책 정의 (http://localhost:3000 허용)
    // @Bean
    // public CorsConfigurationSource corsConfigurationSource() {
    //     CorsConfiguration configuration = new CorsConfiguration();
        
    //     // React 앱의 주소 허용
    //     configuration.addAllowedOrigin("http://localhost:3000"); 
    //     configuration.addAllowedMethod("*");
    //     configuration.addAllowedHeader("*");
    //     configuration.setAllowCredentials(true);

    //     UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    //     source.registerCorsConfiguration("/**", configuration); 
    //     return source;
    // }
}