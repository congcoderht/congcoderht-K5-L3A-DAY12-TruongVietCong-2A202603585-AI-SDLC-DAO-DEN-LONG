# Phase 1 — tiêu chí nghiệm thu từ PRD-0

| ID | Tiêu chí | Bằng chứng dự kiến |
|---|---|---|
| P1-01 | Mây bắt đầu tại (0,0,0), di chuyển theo camera, nhảy được | scenario/input headless; chạy tương tác trên trình duyệt |
| P1-02 | Đêm 1 có đảo bán kính 40m, 5 đèn tại vị trí PRD-0, 24 điểm đom-đóm | snapshot tick 0 |
| P1-03 | Nhặt tối đa 10 đom-đóm, nạp đèn theo cost, thắp đủ đèn để thắng | scenario nạp/ thắng |
| P1-04 | Bóng Mực xuất hiện theo lịch, đuổi Mây, gây hit; Tỏa Sáng tốn tài nguyên, choáng/đẩy Bóng Mực | scenario shade/pulse/hit |
| P1-05 | Hết máu hoặc hết giờ là thua; thắng/thua có điểm và chơi lại được | scenario hit/time/win; UI result |
| P1-06 | JSONL tick-0 snapshot, event và end; tọa độ làm tròn 3 số; cùng seed/input cho output giống nhau | CLI regression |

PRD-0 để ngỏ hầu hết số tuning. Các giả định tạm được đặt ở `src/config.js`, chưa được xác nhận là số chuẩn do giảng viên phát hành.
