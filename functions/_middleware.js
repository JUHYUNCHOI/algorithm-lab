// Cloudflare Pages 미들웨어 — 비밀번호 보호
// 비밀번호를 변경하려면 아래 ACCESS_PASSWORD 값만 수정하세요.
const ACCESS_PASSWORD = 'girin2026';

const LOGIN_HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>코딩하는 기린 🦒 - 로그인</title>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body {
  min-height:100vh; display:flex; align-items:center; justify-content:center;
  background:#0f1117; color:#e0e0e0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
}
.login-card {
  background:#1a1d27; border-radius:16px; padding:3rem 2.5rem;
  max-width:400px; width:90%; box-shadow:0 8px 32px rgba(0,0,0,0.4);
  text-align:center;
}
.logo { font-size:3rem; margin-bottom:0.5rem; }
h1 { font-size:1.4rem; margin-bottom:0.3rem; color:#fff; }
.subtitle { font-size:0.85rem; color:#888; margin-bottom:2rem; }
.input-group { position:relative; margin-bottom:1rem; }
input[type="password"] {
  width:100%; padding:0.85rem 1rem; border-radius:10px;
  border:1.5px solid #2a2d3a; background:#12141c; color:#e0e0e0;
  font-size:1rem; outline:none; transition:border-color 0.2s;
}
input[type="password"]:focus { border-color:#7c6aef; }
button {
  width:100%; padding:0.85rem; border-radius:10px; border:none;
  background:linear-gradient(135deg,#7c6aef,#5b4cc4); color:#fff;
  font-size:1rem; font-weight:600; cursor:pointer; transition:opacity 0.2s;
}
button:hover { opacity:0.9; }
.error { color:#ef4444; font-size:0.82rem; margin-top:0.8rem; display:none; }
.error.show { display:block; }
.footer { margin-top:2rem; font-size:0.72rem; color:#555; }
</style>
</head>
<body>
<div class="login-card">
  <div class="logo">🦒</div>
  <h1>코딩하는 기린</h1>
  <p class="subtitle">Algorithm Lab에 접속하려면 비밀번호를 입력하세요</p>
  <form method="POST" action="/__auth">
    <div class="input-group">
      <input type="password" name="password" placeholder="비밀번호 입력" autofocus required>
    </div>
    <button type="submit">입장하기</button>
    <p class="error" id="err">비밀번호가 올바르지 않습니다</p>
  </form>
  <p class="footer">접근 권한이 없다면 선생님께 문의하세요</p>
</div>
<script>
if (location.search.includes('error=1')) document.getElementById('err').classList.add('show');
</script>
</body>
</html>`;

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  // POST /__auth → 비밀번호 확인
  if (url.pathname === '/__auth' && request.method === 'POST') {
    const formData = await request.formData();
    const pw = formData.get('password');

    if (pw === ACCESS_PASSWORD) {
      // 인증 성공 → 쿠키 설정 후 메인으로 리다이렉트
      return new Response(null, {
        status: 302,
        headers: {
          'Location': '/',
          'Set-Cookie': `girin_auth=authenticated; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}`,
        },
      });
    } else {
      // 비밀번호 틀림
      return new Response(null, {
        status: 302,
        headers: { 'Location': '/?error=1' },
      });
    }
  }

  // 이미 인증된 사용자 → 통과
  const cookie = request.headers.get('Cookie') || '';
  if (cookie.includes('girin_auth=authenticated')) {
    return context.next();
  }

  // 미인증 → 로그인 페이지 표시
  return new Response(LOGIN_HTML, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
