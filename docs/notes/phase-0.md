# Phase 0 — chuẩn bị môi trường và yêu cầu

Ngày chuẩn bị: 2026-11-21 (ICT)

## Phạm vi

Checkpoint 0 theo `CHECKPOINTS.md`: chọn nền tảng, kiểm tra runtime headless, và chuẩn bị nơi lưu giả định/bằng chứng. Đây chưa phải bản game Phase 1. PRD-0 đã được cung cấp để chuẩn bị kiến trúc và tiêu chí, nhưng không được xem smoke check dưới đây là bằng chứng hoàn thành PRD.

## Đọc PRD-0: yêu cầu đã xác định

- Game 3D góc nhìn thứ ba: Mây chạy/nhảy trên Đêm 1 — Đảo Bến, thu thập đom đóm, nạp 5 Đèn Lồng Lớn, tránh Bóng Mực và dùng pulse để xua chúng.
- Có HUD, điểm số, trạng thái thắng/thua và chơi lại; phong cách đêm cổ tích, ánh sáng vàng cam đối lập tím đen, không bạo lực/máu me.
- Phải có `game.contract.json` ở gốc repo và CLI headless chạy mô phỏng 60 tick/giây, không cửa sổ/GPU.
- Headless phải nhận `--seed`, `--night`, tùy chọn scenario/inputs, `--ticks`, `--out`, `--snapshot-every`; xuất JSONL theo contract, kết thúc bằng một dòng `end`, mã thoát 0 khi chạy hợp lệ.
- Cùng seed + scenario + inputs phải cho output giống hệt; scenario dựng sẵn không phát event/không cộng điểm. Thứ tự frame tăng nghiêm ngặt; khoảng cách đo trên mặt phẳng XZ.
- Tuning trong contract phải khớp giá trị thật của game; dùng `null`/`false` khi không áp dụng và giải thích trong README. Không tự khai số trước khi gameplay dùng các số đó.
- Bàn giao Phase 1 gồm game chạy được, README cài/chạy tối đa 3 lệnh, contract, bằng chứng thật, giả định/nhật ký AI và harness trong lịch sử Git; tag `phase-1`.

## Quyết định kỹ thuật

- Runtime và ngôn ngữ: Node.js 20+ với JavaScript ES modules. Lý do: có sẵn trong môi trường; cùng ngôn ngữ có thể dùng cho CLI headless và giao diện web đa nền tảng; phần mô phỏng thuần Node không cần GPU.
- Kiến trúc Phase 1 dự kiến: mô phỏng thuần, tất định ở lõi; renderer 3D trình duyệt tách riêng. Chỉ thêm thư viện renderer khi làm Phase 1 và ghi cách cài/chạy tương ứng.
- Kiểm tra CP0: `npm run hello:headless` chạy `scripts/hello-headless.mjs`, không cần cài dependency ngoài.

## Giả định cần giữ rõ

- PRD-0 mô tả gameplay nhưng không định lượng tốc độ, sức chứa, giá đèn, máu, thời lượng đêm, bán kính hay điểm. Chưa chốt các giá trị này; sẽ chọn hợp lý khi lập kế hoạch Phase 1, khai báo thống nhất trong game và contract.
- “Đảo tròn” sẽ được hiện thực bằng vùng chơi tròn; luật rơi khỏi đảo phải khớp `fall_enabled` và tuning được khai báo.
- HUD/gameplay trực quan không được tham gia sinh output headless; hiệu ứng/nhân vật sáng tạo phải tắt hoặc cô lập trong chế độ headless nếu có thể làm đổi kết quả.

## Bằng chứng CP0

Chạy lệnh sau trong repo:

```text
npm run hello:headless
```

Kết quả mong đợi là một dòng JSON có `type=hello`, `phase=0`, `runtime=node`, `headless=true` và mã thoát 0. Đây chỉ xác nhận Node chạy được; không phải bằng chứng cho các yêu cầu gameplay của PRD-0.

## Nhật ký AI

- Hỗ trợ: trích yêu cầu từ PRD-0, đề xuất cấu trúc headless/render tách biệt và tạo smoke check runtime.
- Token/chi phí: không có số liệu đáng tin cậy trong phiên; không ước lượng giả. Ghi số liệu thực tế từ công cụ AI nếu giao diện cung cấp.
