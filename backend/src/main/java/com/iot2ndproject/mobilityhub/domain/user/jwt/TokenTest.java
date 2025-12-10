package com.iot2ndproject.mobilityhub.domain.user.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Header;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Base64;
import java.util.Date;

/*
Json Web Token
    -인증된 사용자임을 증명하는 표식
    -.을 기준으로 나누어져 있다.
     {헤더}.{body}.{헤더와 바이를 서명한 해시값}
                   -----------------------
                   시크릿 키
    헤더 : 토큰의 유형과 암호 서명 알고리즘
    body : 페이로드
            -----
            사용자id, 실제 전달하고 싶은 정보(claim)
            내용이 모두 오픈되므로 중요한 정보를 담을 수 없다.(비밀번호 X)
            페이로드에 데이터를 많이 담으면 토큰이 길어져서 네트워크 전송 비용이 늘어나므로
            적당한 데이터를 정의
    시크릿키 : base64로 인코딩한 값
             -------------------
             혹시 깨지는 값이나 특수문자가 포함되어 있을 수 있으므로 안전하게 포장
 */
public class TokenTest {
    public static void main(String[] args) throws InterruptedException {
        //1. 비밀키 생성(보통은 yaml파일에 정의) - H256알고리즘을 사용하려면 키가 32byte이상
        String secretKey = "springsecurity-jwt-react-test-mqtt-raspberrypi";
        //=> 문자열을 byte[]로 변환(utf-8)
        byte[] datas = secretKey.getBytes(StandardCharsets.UTF_8);
        System.out.println(datas);
        //=> Base64로 인코딩
        String encodingSecretKey = Base64.getEncoder().encodeToString(datas);
        System.out.println(encodingSecretKey);

        Key key = Keys.hmacShaKeyFor(encodingSecretKey.getBytes());
        //1. 토큰 생성
        //토큰에 담을 정보
        String userId = "bts1";
        String role = "ROLE_ADMIN";

        //유효시간 - 1시간
        Date now = new Date();
        Date exDate = new Date(now.getTime()+(5000));

        String jwtToken = Jwts.builder()
                .setHeaderParam(Header.TYPE,Header.JWT_TYPE) //헤더: 타입을 정의
                .setSubject(userId) //페이로드: id 정보
                .claim("role",role) //페이로드: 기본으로 지정하는 값이 아닌 사용자 정의 정보
                .setIssuedAt(now) //페이로드 : 발급시간
                .setExpiration(exDate) //페이로드 : 만료시간
                .signWith(key, SignatureAlgorithm.HS256) //서명 : 지정한 시크릿키로 암호화
                .compact();
        System.out.println("생성된 토큰: "+ jwtToken);

        System.out.println("2. 토큰 파싱하기");
        //토큰을 풀어서 내부 정보를 꺼내서 확인 - 비밀키가 틀리면 error
        try{
            String data2 = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        String key2 = Base64.getEncoder().encodeToString(data2.getBytes());
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)  //토큰을 생성할 때 사용한 키와 같은 키를 넣고 파싱
                .build()
                .parseClaimsJws(jwtToken) //파싱할 토큰을 지정
                .getBody(); // 토큰에 저장된 데이터 꺼내기
        System.out.println("아이디: "+claims.getSubject());
        System.out.println("권한: "+claims.get("role"));
        System.out.println("만료시간: " + claims.getExpiration());
        System.out.println("토큰검증 성공!! 얘는 우리서버에서 발급한 토큰이 맞다.");}
        catch (Exception e){
            System.out.println("토큰검증 실패 ㅠㅠ 잘못된 토큰으로 로그인을 하려고 합니다.");
            e.printStackTrace();
        }
    }
}
