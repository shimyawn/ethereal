───────────────────────────────────────────────
  에셋 파일 복사 안내 (최초 1회)
───────────────────────────────────────────────

아래 명령어를 프로젝트 루트(docent-web/)에서 실행하세요.

[Windows PowerShell]
  Copy-Item -Recurse ..\docent-assets\images .\public\images
  Copy-Item -Recurse ..\docent-assets\audio  .\public\audio

[macOS / Linux]
  cp -r ../docent-assets/images ./public/images
  cp -r ../docent-assets/audio  ./public/audio

복사 후 public/ 구조:
  public/
  ├── images/
  │   ├── global_map.png
  │   ├── zone0_preshow.jpg
  │   ├── zone1_main.jpg
  │   ├── zone3_main.jpg
  │   ├── zone4_main.jpg
  │   └── postshow_main.jpg
  └── audio/
      ├── docent_zone0.mp3
      ├── docent_zone1.mp3
      ├── docent_zone3.mp3
      ├── docent_zone4.mp3
      └── docent_postshow.mp3

⚠️  zone2_main.jpg / docent_zone2.mp3 파일이 없습니다.
    앱 코드에서 이미지 fallback(색상 그라데이션)으로 처리되어 있습니다.

───────────────────────────────────────────────
  개발 서버 실행
───────────────────────────────────────────────
  npm install
  npm run dev
  → http://localhost:3000
───────────────────────────────────────────────
