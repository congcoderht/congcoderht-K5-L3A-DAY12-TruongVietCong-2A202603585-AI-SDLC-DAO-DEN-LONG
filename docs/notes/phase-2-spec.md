# Phase 2 — Ticket-02 acceptance criteria và quyết định

## Acceptance criteria

| ID | Tiêu chí | Scenario/evidence |
|---|---|---|
| P2-01 | Contract v1.1 khai báo đủ tuning, `--night` nhận 1–3 và snapshot có trường mới | contract/CLI |
| P2-02 | Đêm 1 dùng map chuẩn, điểm sinh, lịch/mức tối đa Bóng Mực; kết quả Phase 1 còn chạy | `night1-regression.json`; deterministic CLI |
| P2-03 | Đêm 2 có hai đảo, cầu, sáu đèn, điểm sinh, bục nhảy và lịch Bóng Mực | `night2-map.json` |
| P2-04 | Đêm 3 có đảo nhiều tầng, dốc/bục nhảy, tháp, gió và lịch Bóng Mực | `night3-wind.json` |
| P2-05 | Gió Lạc sinh theo lịch, đuổi khi đủ đồ, cướp tối đa 3, flee; pulse cứu/drop theo state; không gây mất lửa | `drifter-steal.json`, `drifter-drop.json` |
| P2-06 | Bùa Gió nhặt được, làm mới 600 tick, chạy 7.2m/s; dash theo luật và cooldown | `charm-dash.json` |
| P2-07 | Pause tăng tick ngoài nhưng đóng băng sim/time/cooldowns/spawn/TTL; resume không mô phỏng bước | `pause-resume.json` |
| P2-08 | Chuỗi UI menu/brief/play/result; replay cùng đêm, tiếp tục đêm sau, bình minh; settings lưu local | thao tác trình duyệt |
| P2-09 | HUD, âm thanh sự kiện, 30 FPS trung bình 1280×720 | cần capture/profiling trình duyệt |
| P2-10 | Một đêm headless kết thúc trong ≤30 giây và output tất định | `npm test`, benchmark |

## Giả định chưa xác nhận

Ticket được dán không có bảng “tuning chuẩn Phần 1” và bảng màu mà ticket tham chiếu, dù có nói các giá trị phải trùng chúng. Các số nền chưa có trong PRD-0 (tốc độ Mây, cost đèn, máu, pulse, thời lượng, điểm chi tiết, TTL đom-đóm rơi và cooldown dash) hiện là provisional trong `src/config.js`, đồng bộ với `game.contract.json`. Cần thay bằng bảng chuẩn nếu lab phát hành lại. Dash tạm dùng 14m/s trong 12 tick theo luật bùa, cooldown 2 giây; TTL đom-đóm rơi tạm 15 giây.

## Thay đổi từ Phase 1

- Bổ sung `night`, `sim_tick`, pause, dash, gió, bùa, Gió Lạc, mote TTL và snapshot đầy đủ.
- Chuẩn hóa điểm theo Ticket-02. Mọi test cũ cần so theo contract v1.1 và số provisional hiện tại.
- Bóng Mực dùng các state chuẩn `spawning`, `wander`, `chase`, `recoil`, `stunned`; recoil hiện được biểu diễn trong 12 tick trước khi tiếp tục choáng.

## Giới hạn kiểm chứng hiện tại

- Bằng chứng benchmark headless không đo được ngưỡng 30 FPS trên trình duyệt 1280×720. Cần capture bằng trình duyệt thật.
- Bản đồ Night 3 dùng mesh tầng/dốc đơn giản; các luật mô phỏng tầng cao và bục nhảy được kiểm tra qua scenario, còn va chạm hình học trực quan cần kiểm tra thủ công.
- Âm thanh được tạo bằng Web Audio oscillator, không có file nhạc/hiệu ứng thu âm bên ngoài.
