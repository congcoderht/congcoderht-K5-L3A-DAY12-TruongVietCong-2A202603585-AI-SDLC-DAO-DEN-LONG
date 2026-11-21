# Đảo Đèn Lồng

Game trình duyệt góc nhìn xiên 3D, điều khiển Mây thu đom đóm, thắp đèn và sống sót qua ba đêm. Phần mô phỏng chạy JavaScript thuần ở 60 tick/giây; chế độ headless không tạo cửa sổ, không cần GPU.

## Chạy

Yêu cầu Node.js 20 trở lên.

```sh
npm run build
npm run start
```

Mở `http://127.0.0.1:5173`. Headless: `node src/cli.mjs --seed 1 --night 1 --ticks 600 --out out.jsonl`.

## Điều khiển

- WASD / phím mũi tên: di chuyển; rê chuột: xoay hướng camera.
- Space: nhảy; Shift: lướt; Q: Tỏa Sáng; E: nạp đèn; Esc/P: tạm dừng.
- Đứng cạnh đèn và nhấn E để nạp. Đêm hoàn tất khi mọi đèn sáng.

## Điểm

+10 mỗi đom đóm nạp vào đèn, +100 mỗi đèn thắp, +5 mỗi Bóng Mực trúng Tỏa Sáng; khi thắng cộng `floor(giây còn lại) × 2 + 50 × Ngọn Lửa còn lại`. Điểm được cộng dồn qua các đêm trong một phiên chơi.

## Headless và kiểm chứng

- Contract: `game.contract.json` (v1.1).
- Chạy scenario: thêm `--scenario path.json`; điều khiển: `--inputs path.json`; chọn đêm bằng `--night 1|2|3`.
- Chạy kiểm tra: `npm test`.
- Tiêu chí/giả định Phase 1 và Phase 2: `docs/notes/phase-1-spec.md`, `docs/notes/phase-2-spec.md`.

## Sáng tạo của tôi

- Mây có chiếc đèn lồng nhỏ làm điểm sáng dẫn đường. Đây là hiệu ứng trình bày; không tham gia mô phỏng headless.
- Ở HUD, mỗi ngọn lửa còn lại hiện bằng biểu tượng lửa, còn điểm và thanh đom đóm được giữ rõ trong ba tỉ lệ màn hình.

## Giả định kỹ thuật

Ticket-02 bản được cung cấp có bản đồ và luật mới nhưng không kèm bảng số tuning mà nội dung gọi là “Phần 1”. Vì vậy các giá trị Phase 1 chưa được chuẩn hóa trong PRD-0 được ghi rõ là giả định tạm trong `src/config.js` và đồng bộ với `game.contract.json`. Cần thay bằng bảng chuẩn của lab nếu được cung cấp.
