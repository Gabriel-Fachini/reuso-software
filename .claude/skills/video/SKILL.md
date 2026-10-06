---
name: video
description: Gera o vídeo MP4 de prévia da apresentação (1080p, modo automático) e confere se ficou correto. Use quando pedirem o vídeo, a prévia, o MP4 ou "exporta a apresentação".
disable-model-invocation: true
---

1. Rode `npm run check`. Se falhar, mostre os problemas e pergunte se quer gerar o vídeo mesmo assim.
2. Rode `npm run export:mp4` (leva alguns minutos; rode em segundo plano e acompanhe).
3. Confira com `ffprobe` a duração e a resolução (1920×1080, 30 fps).
4. Extraia uma folha de quadros (`ffmpeg -i out/apresentacao.mp4 -vf "fps=1/15,scale=640:360,tile=4x4" -frames:v 1 out/video-sheet.png`) e olhe com Read para confirmar que as cenas aparecem completas e na ordem.
5. Responda com o caminho `out/apresentacao.mp4`, a duração e qualquer problema visto. O tempo de cada passo no vídeo é o campo `hold` em `src/scenes/index.ts`.
