 Day 12 · AI SDLC Lab · Phase 1
PRD-0 · Đảo Đèn Lồng
Bản mô tả đầu tiên từ khách hàng. Phần yêu cầu cố ý ở mức tổng quát. Phần Test Contract v1.0 ở cuối là bắt buộc và chính xác, vì bài của các bạn sẽ được chạy và chấm tự động.

Tag nộp: phase-1
Contract v1.0
Khoảng 60 phút
Đúng yêu cầu > phức tạp
1Chúng tôi muốn gì
Chúng tôi muốn một game 3D tên là Đảo Đèn Lồng.

Người chơi điều khiển Mây, người giữ đèn nhỏ tuổi của một hòn đảo giữa biển mây. Đêm nay sương đen đã nuốt hết ánh sáng của đảo. Mây phải chạy khắp đảo thu thập những đốm sáng (đom đóm) rồi mang về thắp lại các Đèn Lồng Lớn.

Trong bóng tối có Bóng Mực, những sinh vật bằng mực đen sống trong sương. Chúng đuổi theo Mây; bị chúng chạm vào thì mất máu. Mây có thể tỏa sáng để xua chúng đi, nhưng việc đó tốn ánh sáng. Bóng Mực sợ những chiếc đèn.

Thắp hết đèn thì thắng. Mất hết máu thì thua. Có điểm số.

2Phạm vi Phase 1
Một màn chơi: Đêm 1 – Đảo Bến, một hòn đảo tròn có 5 Đèn Lồng Lớn.
Nhân vật đi lại, nhảy, camera 3D.
Đom đóm xuất hiện rải rác trên đảo, nhặt được.
Nạp ánh sáng vào đèn để thắp đèn.
Bóng Mực xuất hiện và đuổi người chơi.
Tỏa sáng để xua Bóng Mực.
Thắng, thua, điểm số, giao diện hiển thị thông tin cần thiết (HUD).
Có thể chơi lại sau khi thắng hoặc thua.
3Cảm giác & phong cách
Không khí đêm, ấm áp, cổ tích
Đảo sáng dần lên khi thắp đèn
Ánh sáng vàng cam ấm là thứ tốt
Màu tím đen là nguy hiểm
Phong cách đồ họa đơn giản nhưng đẹp. Không cần đồ họa chân thực.
Mây đội nón lá có treo một chiếc đèn lồng nhỏ.
Không bạo lực, không máu me.
Tự do sáng tạo (khuyến khích)
PRD-0 chỉ là khung. Ngoài những gì đã nêu, bạn được tự do sáng tạo thêm: nhân vật mới, kẻ địch mới (ngoài Bóng Mực), nhân vật phụ, loại Bóng Mực hay đom đóm khác nhau, cơ chế nhỏ, sự kiện bất ngờ, câu chuyện, hiệu ứng, âm thanh, cách thể hiện ánh sáng, chi tiết trên đảo. Hãy làm cho game mang dấu ấn của bạn.

Không phá những gì PRD-0 và Test Contract đã yêu cầu. Phần thêm không được làm đổi đầu ra headless theo contract (ví dụ thực thể thêm nên tắt khi chạy headless).
Nói rõ trong README (một mục ngắn "Sáng tạo của tôi") bạn đã thêm gì, và có bằng chứng ngắn rằng phần cũ vẫn đúng.
Làm lõi đúng trước, sáng tạo sau, và cân nhắc token: một ý sáng tạo nhỏ, gọn, chạy đúng hơn nhiều ý dở dang.
4Không bắt buộc công nghệ
Bạn được tự chọn engine, ngôn ngữ và framework. Game phải chạy được trên laptop (macOS hoặc Linux; nếu bạn dùng Windows thì phải có cách chạy trên macOS/Linux cho giảng viên, ví dụ Docker hoặc bản web).

5Bàn giao Phase 1
Nộp bằng tag git phase-1 trên repo public.

Game chơi được Đêm 1 từ đầu tới thắng/thua.
README.md: cách cài đặt và chạy (tối đa 3 lệnh), điều khiển, cách tính điểm của bạn.
game.contract.json và chế độ headless theo Test Contract v1.0 dưới đây.
Bằng chứng game chạy đúng yêu cầu, cùng ghi chép ngắn (giả định, nhật ký dùng AI). Định dạng tự chọn.
Harness AI bạn đã dùng (AGENTS.md hoặc tương đương, skills, hooks…).
6Lưu ý
Game tốt là game đúng yêu cầu của khách hàng, không phải game phức tạp hay đẹp nhất.
Cân nhắc kỹ quota token. Đốt nhiều token không làm bài tốt hơn.
Không có bằng chứng thì chưa xong. "Agent bảo chạy rồi" không phải bằng chứng.
Chỗ PRD-0 còn mơ hồ: tự giả định hợp lý và ghi lại.
Sáng tạo thêm được khuyến khích, nhưng không được làm hỏng phần lõi và Test Contract.
Bắt buộc
Test Contract v1.0
Mọi bài nộp phải có một chế độ chạy không giao diện (headless) để giảng viên chạy kiểm thử tự động, bất kể công nghệ.

A. File game.contract.json ở gốc repo
{
  "contract_version": "1.0",
  "team": "mssv-ho-ten",
  "build_cmd": "lệnh cài đặt/biên dịch",
  "run_cmd": "lệnh mở game có giao diện",
  "headless_cmd": "lệnh chạy headless (sẽ được nối thêm tham số)",
  "tuning": {
    "player_speed": 0,
    "carry_capacity": 0,
    "lantern_cost": 0,
    "lantern_count_night1": 5,
    "pickup_radius": 0,
    "interact_radius": 0,
    "pulse_cost": 0,
    "pulse_radius": 0,
    "night1_duration_s": 0,
    "flames": 0,
    "invuln_s": 0,
    "hit_drop_ratio": 0,
    "pulse_stun_s": 0,
    "pulse_push_m": 0,
    "pulse_cooldown_s": 0,
    "safe_radius": 0,
    "shade_speed": 0,
    "shade_hit_radius": 0,
    "fall_enabled": false,
    "score": { "per_mote": 0, "per_lantern": 0, "per_stun": 0,
               "per_second_left": 0, "per_flame_left": 0 }
  }
}
tuning: bạn điền đúng các số mà game của bạn đang dùng. Nếu game không có khái niệm đó, điền null (hoặc false) và giải thích trong README. Bài test Phase 1 sinh tình huống dựa trên các số này, nên khai sai sẽ làm trượt test.
Ý nghĩa: hit_drop_ratio là tỉ lệ đom đóm đánh rơi khi bị chạm (0 nếu không rơi); safe_radius là bán kính quanh đèn mà Bóng Mực không vào được; fall_enabled cho biết rơi khỏi đảo có bị phạt hay không; score.* là điểm cho mỗi sự kiện.
Lệnh phải chạy được trên macOS/Linux sau build_cmd. Docker được phép.
B. Tham số headless
<headless_cmd> --seed <int> --night 1 [--scenario <file.json>] [--inputs <file.json>]
               --ticks <int> --out <file.jsonl> [--snapshot-every <int, mặc định 10>]
Logic game chạy ở 60 tick/giây cố định (1 tick = 1/60 giây), không cần cửa sổ, không cần GPU, nhanh nhất có thể.
Dừng khi chạy đủ --ticks hoặc khi game kết thúc (thắng/thua). Thoát với mã 0.
Lỗi → mã thoát khác 0, thông báo lỗi ra stderr. File inputs/scenario sai định dạng → mã thoát 2.
Đơn vị độ dài là mét; trục Y hướng lên; mặt đất đảo ở Y = 0; người chơi xuất phát tại (0, 0, 0).
Mô hình tick (để mọi bài đếm giống nhau)
Snapshot tick 0 là trạng thái sau khi dựng scenario, trước khi áp dụng input.
Bước thứ k (k = 0 … N−1) đọc input của tick k và tạo ra trạng thái k+1. Sự kiện xảy ra trong bước đó ghi tick = k+1. --ticks N thực hiện đúng N bước.
time_left_s = thời lượng Đêm − (số bước đã chạy) / 60.
Quy ước vị trí
player.pos là chân nhân vật; shade.pos là tâm Bóng Mực; lantern.pos là chân cột đèn; vị trí đom đóm là điểm trên mặt đất (độ cao lơ lửng chỉ là hiển thị).
Mọi khoảng cách trong tuning đo giữa các điểm này, theo mặt phẳng ngang XZ, không cộng thêm kích thước nhân vật. "Trong bán kính r" nghĩa là khoảng cách ≤ r.
C. File inputs
{
  "frames": [
    { "tick": 0,   "move": [0, 1], "cam_yaw_deg": 0 },
    { "tick": 120, "move": [0, 0], "interact": true },
    { "tick": 121, "interact": false },
    { "tick": 200, "pulse": true },
    { "tick": 201, "pulse": false }
  ]
}
Giá trị mặc định trước frame đầu tiên: move [0,0], cam_yaw_deg 0, mọi nút false.
Mỗi frame chỉ đổi các trường có mặt trong frame đó; trường vắng mặt giữ giá trị cũ.
tick của các frame phải tăng nghiêm ngặt (không trùng, không giảm).
move: [x, z], mỗi thành phần trong [−1, 1]. Với θ = cam_yaw_deg đổi sang radian, hướng di chuyển trong thế giới là x' = x·cosθ + z·sinθ, z' = −x·sinθ + z·cosθ (khi θ = 0 thì x là +X, z là +Z). Vector dài hơn 1 phải được chuẩn hóa về độ dài 1.
jump, interact, pulse (và dash nếu có): boolean, hành động kích hoạt khi giá trị chuyển từ false sang true.
Không có file inputs nghĩa là người chơi đứng yên.
D. File scenario (dựng tình huống cho test)
{
  "player": { "pos": [0, 0, 0], "carried": 0, "flames": 3 },
  "random_motes": false,
  "random_shades": false,
  "motes": [[0, 0, 5]],
  "shades": [{ "pos": [10, 0, 0] }],
  "lanterns": [{ "id": "L1", "pos": [0, 0, 25], "deposited": 0 }],
  "time_left_s": 300
}
random_motes: false: không tự sinh đom đóm, chỉ có những con được liệt kê.
random_shades: false: không tự sinh Bóng Mực, chỉ có những con được liệt kê (ở trạng thái hoạt động bình thường ngay lập tức).
lanterns: cập nhật theo id các đèn của màn (L1…L5). Đèn không được nhắc tới giữ nguyên; có pos thì đổi vị trí; có thể đặt lit: true.
motes, shades: thay thế danh sách ban đầu tương ứng; mảng rỗng nghĩa là không có con nào. shades[] có thể kèm id để test tham chiếu.
Trường nào không có thì dùng mặc định của game.
Dựng scenario không phát sự kiện và không cộng điểm (ví dụ đèn đặt sẵn lit: true không được cộng điểm thắp đèn).
E. Output JSONL
Mỗi dòng là một đối tượng JSON, gồm ba loại.

Snapshot, mỗi --snapshot-every tick, bắt đầu từ tick 0:

{"type":"snapshot","tick":120,"sim_tick":120,"state":"playing","time_left_s":298.0,"score":20,
 "player":{"pos":[0.0,0.0,12.0],"flames":3,"carried":2},
 "lanterns":[{"id":"L1","pos":[0,0,25],"lit":false,"deposited":0}],
 "shades":[{"id":"S1","pos":[30.1,1.0,2.0],"state":"chase"}],
 "motes_active":19}
Event, ghi ngay khi sự kiện xảy ra. Ví dụ: {"type":"event","tick":131,"name":"mote_picked","data":{"carried":3}}

name	data
mote_picked	{"carried": n}
deposit	{"lantern_id": "L1", "amount": n, "deposited": n}
lantern_lit	{"lantern_id": "L1"}
pulse	{"stunned_ids": ["S1"]}
player_hit	{"by": "shade" | "fall", "flames": n, "dropped": n}
shade_spawned	{"id": "S3"}
game_over	{"result": "won" | "lost", "reason": "all_lit" | "dawn" | "no_flames"}
End, dòng cuối cùng và bắt buộc: {"type":"end","ticks":4800,"state":"won","score":1730}

state thuộc playing, won, lost. Trạng thái Bóng Mực tối thiểu phải có stunned; các trạng thái khác do bạn đặt tên.
Tọa độ làm tròn 3 chữ số thập phân.
Tính tất định: cùng --seed, cùng scenario và cùng inputs phải cho output giống hệt nhau giữa hai lần chạy, kể cả các id tự sinh. Các bạn không cần sinh cùng chuỗi ngẫu nhiên với nhau.
sim_tick là số bước gameplay đã chạy (ở Phase 1 bằng tick).
Mảng motes (mỗi phần tử id, pos) trong snapshot là khuyến nghị ở v1.0.
Nếu một sự kiện không xảy ra trong game của bạn (ví dụ không có rơi khỏi đảo) thì không ghi sự kiện đó.


TICKET-02 — "Ba hòn đảo" (Phase 2)
Loại: Feature + chuẩn hóa · Ưu tiên: Cao · Tag nộp: phase-2 · Contract: v1.1

Bối cảnh
Đêm 1 đã chạy được. Nhà sản xuất chơi thử bản của các bạn và thấy mỗi bản cho cảm giác điều khiển rất khác nhau. Ticket này có hai việc: (1) đồng bộ số liệu chuẩn để mọi bản cho cảm giác giống nhau, và (2) mở rộng game thành 3 Đêm cùng các tính năng mới.

Về sáng tạo: những gì bạn đã sáng tạo thêm ở Phase 1 vẫn được giữ và bạn vẫn được thêm ý riêng, kể cả nhân vật mới và kẻ địch mới (ngoài Bóng Mực và Gió Lạc), miễn là số liệu chuẩn, bản đồ chuẩn và Test Contract dưới đây không bị đổi và phần thêm không làm đổi đầu ra headless (ví dụ tắt khi chạy headless).

Phần 1 — Số liệu chuẩn (bắt buộc, thay mọi giá trị bạn tự chọn)
Logic chạy 60 tick/giây. Đơn vị: mét, giây. Trục Y hướng lên.

Nhóm	Hằng số	Giá trị
Di chuyển	Tốc độ chạy	6.0 m/s; tăng tốc/dừng trong ≤ 0.1 s; điều khiển trên không đầy đủ
Nhảy	Vận tốc 7.0 m/s, trọng lực −20 m/s², chỉ nhảy khi chạm đất
Lướt (mới)	Tốc độ / thời gian / hồi chiêu	14 m/s / 0.2 s / 1.5 s (tính từ lúc bắt đầu lướt)
Hướng	Hướng đang di chuyển; nếu đứng yên thì hướng nhân vật đang quay mặt. Lướt trên không giữ nguyên độ cao. Không bất tử khi lướt
Đom đóm	Sức chứa	10
Nhặt	Tự động khi khoảng cách XZ ≤ 1.0 m và chênh cao giữa chân Mây và mặt đất nơi đặt đom đóm ≤ 1.5 m
Số lượng	20 lúc bắt đầu tại 20 điểm khác nhau; trần 30; tại các tick 240, 480, … sinh thêm 1 ở một điểm trống nếu dưới 30; hết điểm trống thì bỏ lượt
Đèn lồng	Chi phí thắp	10 đom đóm, nạp nhiều lần được, đèn nhớ tiến độ
Tương tác	Trong bán kính 2.0 m; mỗi lần bấm nạp min(đang mang, còn thiếu) vào một đèn. Chỉ xét đèn chưa sáng; chọn đèn gần nhất, bằng nhau thì id nhỏ hơn
Vùng an toàn	Đèn đã sáng tạo vùng bán kính 6 m: Bóng Mực ở ngoài bị chặn ở mép 6 m. Bóng đang ở trong lúc đèn vừa thắp bị đẩy ra mép trong tối đa 30 tick và không gây sát thương trong lúc đó
Tỏa Sáng	Chi phí / bán kính / hồi chiêu	3 đom đóm / 5 m / 3 s
Hiệu ứng	Tâm = chân Mây + 0.8 m. Mục tiêu chốt ngay tick kích hoạt (khoảng cách 3D tới tâm Bóng Mực ≤ 5 m). Bóng Mực choáng 120 tick, trong 15 tick đầu bị đẩy lùi tổng 4 m theo phương ngang (dừng nếu gặp vật cản; trùng vị trí thì đẩy theo +X). Pulse lại làm mới choáng và đẩy lùi. Không chết. Không đủ 3 đom đóm thì không kích hoạt
Bóng Mực	Tốc độ	4.0 m/s (Đêm 3: 4.5 m/s)
Phát hiện / bỏ đuổi	12 m / 18 m
Chạm	Khoảng cách XZ ≤ 1.0 m và chênh cao ≤ 1.5 m. Tối đa 1 lần mất Ngọn Lửa mỗi tick. Bóng gây hit lùi 2 m trong 60 tick (recoil); bóng chạm lúc Mây bất tử không làm gì
Lịch sinh	2 con tại tick 300, sau đó 1 con mỗi khoảng sinh (tick 300 + 480k ở Đêm 1); hết điểm hợp lệ thì bỏ lượt. Id S1, S2, … theo thứ tự sinh
Bị đánh	Hậu quả	−1 Ngọn Lửa; rơi floor(đang mang / 2) đom đóm ra vành 1.5–2.5 m quanh Mây (tồn tại 480 tick, nhặt lại được từ tick sau); bất tử 90 tick
Rơi khỏi đảo (Y < −10)	Xảy ra đúng 1 lần, bỏ qua bất tử: −1 Ngọn Lửa, mất toàn bộ đom đóm. Chờ 60 tick (không nhặt, không bị chạm), rồi hồi sinh ở điểm xuất phát, vận tốc 0, bất tử 90 tick. Hết Ngọn Lửa thì thua ngay, không hồi sinh
Máu	Ngọn Lửa	3, hồi đầy đầu mỗi Đêm
Thời gian	Đêm 1 / 2 / 3	300 / 330 / 360 s
Thắng / thua		Sau mỗi tick: hết Ngọn Lửa → luôn thua (no_flames); còn sống và tất cả đèn sáng → thắng (kể cả đúng tick hết giờ); còn lại mà hết giờ → thua (dawn)
Điểm (chuẩn hóa): +10 mỗi đom đóm nạp · +100 mỗi đèn thắp · +5 mỗi Bóng Mực trúng Tỏa Sáng (mỗi con mỗi lần, kể cả con đang choáng) · khi thắng: + floor(giây còn lại) × 2 + 50 × Ngọn Lửa còn lại. Tổng điểm game là tổng điểm các Đêm đã thắng.

Thứ tự xử lý trong một tick (bắt buộc)
Đọc input (xử lý pause trước; nếu vừa tạm dừng thì dừng bước ở đây).
Giảm các bộ đếm: thời gian, hồi chiêu, bất tử, choáng, bùa, TTL đom đóm rơi, hồi bùa.
Di chuyển Mây (nhảy, lướt, bục nhảy, gió) rồi kiểm tra rơi khỏi đảo.
Nhặt đom đóm và bùa.
Tương tác với đèn.
Cập nhật vùng an toàn.
Tỏa Sáng.
Di chuyển Bóng Mực và Gió Lạc.
Chạm: Gió Lạc cướp trước, rồi Bóng Mực gây hit (xét theo id tăng dần).
Sinh đom đóm, Bóng Mực, Gió Lạc theo lịch (thực thể mới chỉ tương tác được từ tick sau).
Xét thắng/thua.
Ghi snapshot nếu tới lượt.
Khi đang tạm dừng: tick vẫn tăng nhưng sim_tick, thời gian, hồi chiêu, spawn, TTL đều đứng yên; snapshot ghi state: "paused".

Phần 2 — Bản đồ chuẩn
Góc đo từ trục +X, ngược chiều kim đồng hồ khi nhìn từ trên xuống, trên mặt phẳng XZ.

Đêm 1 — Đảo Bến (chuẩn hóa lại)
Đảo tròn tâm (0,0,0), bán kính 40 m. Ngoài 40 m là biển mây (rơi).
Xuất phát (0,0,0), quay mặt về +Z.
Đèn: L1 (0,0,25) · L2 (23.8,0,7.7) · L3 (14.7,0,−20.2) · L4 (−14.7,0,−20.2) · L5 (−23.8,0,7.7).
Điểm sinh đom đóm: 8 điểm trên bán kính 12 m (mỗi 45°) và 16 điểm trên bán kính 33 m (mỗi 22.5°).
Bóng Mực sinh trên 12 điểm bán kính 37 m (15°, 45°, …), cách người chơi ≥ 15 m; 2 con lúc giây thứ 5, sau đó mỗi 8 s; tối đa 6.
Đêm 2 — Đảo Cau (mới)
Hai đảo tròn bán kính 28 m, tâm A (0,0,0) và B (70,0,0), nối bằng cầu tre x ∈ [26, 44], z ∈ [−2, 2], không lan can.
Bục nhảy hình tròn bán kính 1 m tại (20,0,18) và (50,0,−18): chân Mây chạm bục thì được bắn lên với vận tốc Y 14 m/s và vận tốc ngang 24 m/s hướng về tâm đảo kia. Vận tốc phóng giữ nguyên tới khi chạm đất (phím di chuyển không ghi đè; vẫn được lướt). Bay khoảng 1.4 s, đáp trong đảo đích.
Điểm sinh đom đóm mỗi đảo: 4 điểm trên bán kính 10 m (0°, 90°, 180°, 270°) và 8 điểm trên bán kính 22 m (mỗi 45°). Bóng Mực sinh trên 8 điểm bán kính 26 m mỗi đảo (22.5°, 67.5°, …).
Đèn: (0,0,20), (17,0,−10), (−17,0,−10), (70,0,20), (87,0,−10), (53,0,−10), id L1…L6 theo thứ tự này.
Bóng Mực: sinh mỗi 7 s, tối đa 8.
Đêm 3 — Đảo Chuông (mới)
Đảo tròn bán kính 45 m, có 3 tầng: tầng 0 (Y=0) toàn đảo; tầng 1 (Y=3) là vành khăn bán kính 12–24 m ở nửa có z > 0; tầng 2 (Y=6) là đĩa bán kính 8 m ở tâm.
Mép các tầng là vách đứng (không đi lên được; bước ra thì rơi xuống tầng dưới).
2 dốc thẳng rộng 3 m dọc theo bán kính ở góc 30° và 150°: chân dốc ở bán kính 30 m (Y=0), đỉnh dốc ở bán kính 24 m (Y=3).
Bục nhảy bán kính 1 m tại (0,3,13): vận tốc Y 12 m/s và vận tốc ngang 8 m/s hướng −Z, giữ tới khi chạm đất → đáp lên tầng 2.
Tháp chuông cao 8 m ở tâm tầng 2, hình trụ bán kính 2 m, không leo được.
Điểm sinh đom đóm (30): tầng 0 có 18 điểm bán kính 34 m (mỗi 20° từ 0°); tầng 1 có 8 điểm bán kính 18 m (20°, 40°, …, 160°); tầng 2 có 4 điểm bán kính 5 m (45°, 135°, 225°, 315°). Bóng Mực sinh trên 16 điểm bán kính 43 m (mỗi 22.5°).
Đèn (L1…L7): (0,6,6), (18,3,10), (−18,3,10), (35,0,−10), (−35,0,−10), (20,0,−35), (−20,0,−35).
Gió mạnh: mỗi 30 s có một cơn gió kéo dài 5 s theo hướng ngẫu nhiên, đẩy người chơi 2 m/s; báo trước 2 s bằng lá bay và âm thanh.
Bóng Mực: sinh mỗi 6 s, tối đa 10.
Phần 3 — Tính năng mới
Gió Lạc (Đêm 2 và 3): dải lụa xám xanh bay nhanh (7 m/s), tối đa 2 con, sinh tại tick 1200, 2400, … trên điểm sương ngẫu nhiên, id D1, D2, …
Trạng thái: idle (lượn chậm 2 m/s) → chase → flee → removed.
idle → chase khi Mây mang ≥ 5 đom đóm và cách ≤ 15 m (kiểm tra mỗi tick); điều kiện mất thì về idle.
Chạm (XZ ≤ 1.2 m): cướp min(3, đang mang) đom đóm, chuyển flee (bay ra xa Mây 7 m/s trong 240 tick rồi biến mất cùng số đã cướp). Mỗi con chỉ cướp 1 lần.
Tỏa Sáng trúng Gió Lạc đang chase → nó chuyển flee không cướp; trúng lúc flee có mang đồ → thả lại toàn bộ đom đóm đã cướp tại chỗ (thành đom đóm rơi), biến mất sau 120 tick.
Không làm mất Ngọn Lửa; vùng an toàn của đèn không chặn Gió Lạc; bất tử của Mây không ngăn bị cướp.
Bùa Gió: lá bùa đỏ viền vàng, id C1, C2. Nhặt theo luật như đom đóm. Hiệu lực 600 tick (nhặt lại thì làm mới): tốc độ chạy 7.2 m/s và Lướt không hồi chiêu (vẫn cần nhấn lại nút; nhấn khi đang lướt bị bỏ qua; lướt vẫn 14 m/s trong 12 tick). Bùa xuất hiện lại sau 2700 tick. Vị trí: Đêm 2 (35,0,0); Đêm 3 (30,0,25) và (−30,0,25).
Chuỗi 3 Đêm: Menu chính → giới thiệu Đêm (tên đảo, lời Ông Đăng) → chơi → kết quả → Đêm kế tiếp. Thắng Đêm 3 thì hiện màn hình Bình Minh với tổng điểm. Thua thì được chơi lại Đêm đó.
Tạm dừng (Esc/P): logic dừng hoàn toàn. Có Tiếp tục / Chơi lại Đêm / Cài đặt / Về menu.
Cài đặt: âm lượng và độ nhạy chuột, được lưu giữa các lần mở game.
Âm thanh: nhạc nền đêm và hiệu ứng cho: nhặt, thắp đèn, tỏa sáng, bị đánh, nhảy, lướt, thắng, thua, Bóng Mực xuất hiện, đếm ngược 10 s cuối.
HUD đầy đủ: Ngọn Lửa (trên trái), đồng hồ mm:ss (trên giữa, đổi màu đỏ và nhấp nháy khi ≤ 30 s), đèn k/n và điểm (trên phải), thanh đom đóm 10 ô (dưới giữa), biểu tượng hồi chiêu Lướt và Tỏa Sáng (dưới phải), nhắc "E — Nạp ánh sáng (x/10)" khi đứng gần đèn, mũi tên chỉ tới đèn chưa sáng gần nhất khi nó ở ngoài màn hình.
Bảng màu chuẩn (sai lệch tối đa 10% mỗi kênh RGB; áp dụng cho các thành phần liệt kê, màu cho chi tiết khác do bạn tự chọn):
Dùng cho	Hex
Trời đêm / sương	#0E1430 / #1B2350
Cỏ / cát / gỗ / biển mây	#2F5D50 / #C9B48A / #6B4A2F / #12384A
Đèn sáng / lõi / đèn tắt	#FFB347 / #FFE9B0 / #5B5F6E
Đom đóm lõi / quầng	#FFF6C2 / #FFE58A
Bóng Mực thân / viền / bị choáng	#120A1A / #7A3CFF / #3A3450
Áo Mây / khăn Mây và Bùa Gió	#E8E2D0 / #C8102E
Viền vàng, điểm số / Gió Lạc	#F2C14E / #8FA3B8
UI nguy hiểm / chữ UI	#FF5A5F / #F5F1E6
Ánh sáng môi trường tăng theo tiến độ: cường độ = 0.15 + 0.55 × (đèn sáng / tổng đèn).

Phần 4 — Test Contract v1.1 (thay đổi so với v1.0)
contract_version: "1.1"; tuning phải khớp số chuẩn ở Phần 1, thêm các khóa dash_speed, dash_duration_s, dash_cooldown_s, night2_duration_s, night3_duration_s.
--night nhận 1, 2, 3.
Snapshot gốc thêm night, wind {active, dir_deg}. player thêm vel, grounded, invuln, dash_cd_s, pulse_cd_s, charm_s.
Snapshot thêm các mảng bắt buộc: motes (id, pos, kind = random/dropped, ttl_s), drifters (id, pos, state, stolen), charms (id, available, respawn_s).
Scenario thêm player.{invuln_ticks, dash_cd_ticks, pulse_cd_ticks, charm_ticks}, shades[].{state, state_ticks_left}, drifters, charms, cờ random_drifters, wind_enabled. Các mảng drifters, charms thay thế danh sách mặc định.
Input thêm dash và pause (đều kích hoạt khi chuyển false → true).
Sự kiện mới: dash {}, charm_picked {charm_id, charm_ticks}, drifter_steal {drifter_id, amount, carried}, drifter_drop {drifter_id, amount}, night_start {night}, paused {}, resumed {}. player_hit do rơi thêm trường lost.
Từ v1.1, trạng thái Bóng Mực phải dùng đúng tên: spawning, wander, chase, recoil, stunned.
Chạy headless một Đêm đầy đủ (tối đa 21.600 tick) phải xong trong ≤ 30 giây.
Định nghĩa hoàn thành (DoD)
Có bằng chứng game chạy đúng các yêu cầu của phase (định dạng tự chọn).
Mọi test ẩn Phase 1 vẫn đạt khi chạy với số chuẩn (regression).
Tài liệu spec của bạn (tên và vị trí tự chọn) có acceptance criteria cho từng mục ở Phần 3.
File hướng dẫn agent (AGENTS.md hoặc tương đương) và các skill được cập nhật cho phạm vi mới (lịch sử git phải thể hiện).
Test của bạn có ít nhất 1 scenario headless cho mỗi tính năng mới.
Bản thường đạt ≥ 30 FPS trung bình ở 1280×720.

TICKET-03 — CHANGE REQUEST "Đèn cạn dầu" (Phase 3)
Loại: Change Request — thay đổi luật cốt lõi · Ưu tiên: Rất cao · Tag nộp: phase-3 · Contract: v1.2

Vì sao thay đổi
Playtest cho thấy người chơi giỏi thắp hết đèn trong 2 phút rồi game kết thúc, thiếu căng thẳng ở cuối Đêm. Nhà thiết kế quyết định: đèn thắp rồi vẫn có thể tắt, mục tiêu chuyển từ "thắp hết" sang "giữ đảo sáng tới bình minh".

⚠ Ticket này thay thế một số luật đã có. Những luật cũ bị thay được đánh dấu [THAY THẾ]. Bạn phải ghi lại quyết định thiết kế (ví dụ một ADR ngắn) và cập nhật test của mình.

Về sáng tạo: phần sáng tạo của bạn từ các phase trước vẫn được giữ và vẫn được thêm ý riêng (kể cả nhân vật, kẻ địch mới), miễn là luật, số liệu và Test Contract dưới đây không bị đổi và đầu ra headless không đổi. Ý sáng tạo nào xung đột với luật mới thì phải điều chỉnh theo luật mới.

1. Nhiên liệu đèn — [THAY THẾ] luật "đèn đã sáng không nhận thêm đom đóm"
Quy tắc	Giá trị
Nhiên liệu tối đa	100
Khi vừa thắp (lần đầu hoặc thắp lại)	fuel = 100
Hao hụt khi đang sáng	1.0 đơn vị/giây (tính theo tick: 1/60 mỗi tick)
Châm dầu	Bấm Tương tác ở đèn đang sáng: used = min(đang mang, ceil((100 − fuel) / 10)), fuel = min(100, fuel + 10 × used), trừ used đom đóm. Đèn đầy dầu (used = 0) không được chọn khi tương tác, không phát sự kiện, không cộng điểm
Chọn đèn khi tương tác	Chỉ xét đèn nhận được (chưa sáng, hoặc sáng nhưng chưa đầy dầu); gần nhất, bằng nhau thì id nhỏ hơn
Độ chính xác	Nên tính dầu theo đơn vị nguyên 1/60 để không bị sai số số thực; chỉ làm tròn khi xuất ra
Hết dầu (fuel ≤ 0)	Đèn chuyển sang tắt, deposited = 0, phát sự kiện lantern_out, ánh sáng môi trường giảm theo. Đèn nhớ ever_lit = true
Thắp lại	Đèn đã từng sáng (ever_lit) chỉ cần 5 đom đóm; đèn chưa từng sáng vẫn cần 10
Hiển thị	Thanh dầu trên đèn đang sáng; khi fuel < 30 thì đèn và thanh dầu nhấp nháy chậm (1 Hz)
2. Bóng Mực hút dầu — [THAY THẾ] luật "Bóng Mực không bao giờ vào vùng an toàn"
Đèn có fuel < 30 mất vùng an toàn. Đúng 30 thì vẫn còn vùng an toàn.
Chỉ Bóng Mực ở trạng thái wander mới chọn đèn yếu: đi tới đèn sáng có fuel < 30 gần nhất (bằng nhau thì id nhỏ hơn). Không có thì đi về đèn tắt gần nhất như trước. Bóng đang chase không đổi mục tiêu.
Khi cách đèn đó ≤ 2 m (XZ): chuyển sang trạng thái mới drain, đứng yên và hút 5 fuel/giây liên tục (5/60 mỗi tick). Nhiều con thì cộng dồn. Đèn vẫn tự hao 1/giây.
Từ drain: sang chase nếu Mây vào trong 6 m; sang stunned nếu trúng Tỏa Sáng; sang wander nếu đèn tắt, nếu fuel được châm lên ≥ 30, hoặc nếu cách đèn > 2 m.
Hết choáng thì về wander.
Khi đèn được châm dầu lên ≥ 30 lúc có Bóng Mực trong vùng 6 m, các con đó bị đẩy ra mép vùng trong tối đa 30 tick và không gây sát thương trong lúc đó (giống khi đèn vừa thắp).
3. Luật thắng mới — [THAY THẾ] "thắng ngay khi tất cả đèn sáng"
Quy tắc	Giá trị mới
Thời gian Đêm 1 / 2 / 3	240 / 270 / 300 s
Thắng	Mây còn sống khi hết giờ (bình minh) và số đèn đang sáng tại tick cuối ≥ ceil(0.6 × tổng đèn): Đêm 1 cần 3/5, Đêm 2 cần 4/6, Đêm 3 cần 5/7
Không còn thắng sớm	Thắp đủ đèn không kết thúc Đêm
Thua	Hết Ngọn Lửa (ngay lập tức, kể cả ở tick cuối) · hoặc hết giờ mà số đèn sáng dưới ngưỡng
Lý do kết thúc	Thắng: dawn_survived · Thua: dawn hoặc no_flames
Thứ tự trong tick	Theo thứ tự xử lý của Ticket-02, bổ sung: ở bước 2 trừ dầu (hao + bị hút); ngay sau bước 2, đèn có fuel ≤ 0 tắt. Bước "xét thắng/thua" diễn ra sau mọi cập nhật của tick, kể cả tick bình minh: hết Ngọn Lửa luôn thua no_flames trước
4. Sức chứa tăng dần (mới)
Sức chứa = 10 + 2 × successful_lights, tối đa 20. successful_lights = số lần thắp thành công trong Đêm (tính cả thắp lại; đèn đặt sẵn bằng scenario không tính). Đặt lại về 0 ở đầu mỗi Đêm. HUD hiển thị đang mang / sức chứa.

5. Điểm mới — [THAY THẾ] toàn bộ công thức điểm cũ
Sự kiện	Điểm
Mỗi đom đóm nạp vào đèn (thắp mới, thắp lại hoặc châm dầu)	+5
Thắp lần đầu	+100
Thắp lại	+40
Bóng Mực trúng Tỏa Sáng	Tổng +5 mỗi con; tổng +15 nếu ngay trước đó nó đang drain
Bình minh (chỉ khi thắng): mỗi đèn đang sáng	+50 + floor(fuel)
Bình minh (chỉ khi thắng): mỗi Ngọn Lửa còn lại	+50
Thưởng thời gian	Bỏ
Tổng điểm game, chơi lại	Không đổi so với Ticket-02
6. Chế độ mù màu (mới)
Thêm cài đặt "Bảng màu dễ phân biệt" (được lưu):

Viền và mắt Bóng Mực đổi từ #7A3CFF sang #00B3FF.
Màu cảnh báo UI đổi từ #FF5A5F sang #FFFFFF, kèm biểu tượng ⚠.
Đèn tắt và đèn sáng phải phân biệt được không cần màu: đèn tắt bị xẹp 20% và giấy có vết rách; đèn sắp hết dầu nhấp nháy.
7. Test Contract v1.2 (thay đổi)
contract_version: "1.2". tuning thêm fuel_max: 100, fuel_decay_per_s: 1.0, fuel_per_mote: 10, relight_cost: 5, win_ratio: 0.6, drain_per_s: 5, low_fuel_threshold: 30, capacity_max: 20; night1_duration_s = 240, night2_duration_s = 270, night3_duration_s = 300.
Snapshot: mỗi đèn thêm fuel (số thực, 1 chữ số thập phân; đèn tắt có fuel: 0), ever_lit và relit_count; player thêm capacity. Bóng Mực có thêm trạng thái drain.
Scenario: mỗi đèn được đặt lit, fuel, ever_lit; player thêm successful_lights; shades[] thêm target_lantern_id. Đèn đặt lit: true mà không có fuel thì mặc định fuel: 100.
Sự kiện mới: refuel {lantern_id, amount, fuel}, lantern_out {lantern_id}, fuel_drain {lantern_id, shade_id, fuel} (ghi mỗi 60 tick khi đang hút). lantern_lit thêm relight: true|false. game_over.reason có thêm dawn_survived; all_lit không còn dùng.
Định nghĩa hoàn thành (DoD)
Có bằng chứng game chạy đúng các yêu cầu của phase (định dạng tự chọn).
Có ít nhất 1 ghi chú quyết định thiết kế (ADR hoặc tương đương, tên và vị trí tự chọn) mô tả cách bạn thay đổi mô hình trạng thái đèn và luật thắng.
Test cũ bị luật mới làm sai phải được cập nhật hoặc xóa có ghi lý do, không được bỏ qua (skip) âm thầm.
Có changelog (tên và vị trí tự chọn) liệt kê các thay đổi phá vỡ tương thích (breaking changes) của Phase 3.
Mọi test ẩn Phase 1–2 không bị thay thế vẫn đạt.


TICKET-04 — "Bình minh: phát hành v1.0.0" (Phase 4)
Loại: Non-functional + Release · Ưu tiên: Cao · Tag nộp: phase-4 + GitHub Release v1.0.0 · Contract: v1.3

Mục tiêu
Đưa game từ "chạy được" thành sản phẩm phát hành được: đo được hiệu năng, ổn định khi chạy lâu, có bảng xếp hạng, dễ tiếp cận, cài đặt dễ dàng. Mọi yêu cầu dưới đây đều có số đo cụ thể và được chấm tự động hoặc theo checklist.

Về sáng tạo: phần sáng tạo của bạn vẫn được giữ, miễn là luật, số liệu và Test Contract không bị đổi và đầu ra headless không đổi. Trong cảnh benchmark và soak test, nhân vật, kẻ địch và hiệu ứng sáng tạo thêm phải tắt (hoặc không ảnh hưởng số đo), để mọi bài được đo trên cùng một cảnh chuẩn.

1. Chế độ benchmark (bắt buộc)
Lệnh: <bench_cmd> --seed 42 --duration 30 --out bench.json

Cảnh benchmark (mọi bài giống nhau):

Mở cửa sổ 1280×720, không toàn màn hình; tắt vsync nếu engine cho phép (ghi rõ trong README nếu không tắt được).
Tải Đêm 1 với đầy đủ hiệu ứng và ánh sáng như lúc chơi thật.
Sinh đúng 200 Bóng Mực ở trạng thái wander, rải đều trên đảo (seed 42), và đúng 100 đom đóm (bench được phép vượt trần của gameplay). 3 đèn L1–L3 đang sáng với fuel 100.
Trong cảnh bench tắt: sinh thêm thực thể, sát thương, nhặt đom đóm, hao dầu và điều kiện kết thúc Đêm. Bóng Mực vẫn di chuyển theo luật wander bình thường.
Không có input người chơi. Mây đứng yên tại (0,0,0). Camera bay vòng tròn tâm (0,0,0), bán kính 30 m, ở độ cao Y = 15 m, luôn nhìn vào (0,0,0), xuất phát ở góc 0° (điểm (30,15,0)), quay ngược chiều kim đồng hồ khi nhìn từ trên xuống, 15 s một vòng.
3 s đầu là khởi động (không đo). Sau đó đo đúng --duration giây rồi tự thoát với mã 0.
Output bench.json:

{
  "contract_version": "1.3",
  "avg_fps": 87.3,
  "p1_low_fps": 52.1,
  "frame_ms_p95": 14.2,
  "frames": 2619,
  "load_ms": 2400,
  "peak_mem_mb": 512,
  "vsync_off": true,
  "renderer": "mô tả engine/renderer và phiên bản",
  "os": "tự điền"
}
Trường	Định nghĩa
frames	Số khung hình N trong khoảng đo
avg_fps	1000 × N / Σ dt_i, với dt_i là thời gian từng khung (ms)
p1_low_fps	k = max(1, ceil(0.01 × N)); lấy k giá trị dt lớn nhất; p1_low_fps = 1000 / trung bình của k giá trị đó
frame_ms_p95	Phân vị 95 của dt (ms)
load_ms	Từ lúc tiến trình bắt đầu tới khung hình đầu tiên của cảnh bench
peak_mem_mb	Bộ nhớ tiến trình (RSS) cao nhất trong lúc đo; ghi null nếu là bản web không đo được và giải thích
Ngưỡng đạt, đo trên máy chấm của giảng viên: avg_fps ≥ 60 · p1_low_fps ≥ 30 · load_ms ≤ 10000.

Máy chấm: giảng viên sẽ công bố cấu hình (CPU, GPU, RAM, hệ điều hành, chế độ nguồn) trước khi đo. Mọi bài được đo trên cùng máy này; số bạn tự đo chỉ để tham khảo.

2. Soak test (bắt buộc)
Lệnh: <soak_cmd> --seed 7 --nights 10 --out soak.json

Chạy headless 10 Đêm liên tiếp trong cùng một tiến trình (Đêm 1 → 2 → 3 xoay vòng), Đêm thứ i dùng seed 7 + i, mỗi Đêm chạy tới khi kết thúc hoặc hết thời lượng chuẩn. Input ngẫu nhiên theo seed: mỗi 30 tick chọn lại hướng di chuyển; mỗi tick xác suất 5% nhảy, 3% lướt, 2% tỏa sáng, 10% tương tác.
mem_start_mb: bộ nhớ tiến trình (RSS) sau khi tải xong Đêm đầu tiên. mem_end_mb: RSS sau khi reset xong Đêm cuối cùng.
Output:
{"nights": 10, "crashes": 0, "results": ["lost","won","lost"],
 "mem_start_mb": 120, "mem_end_mb": 131, "duration_s": 84.2}
Ngưỡng đạt: crashes = 0 và mem_end_mb ≤ 1.2 × mem_start_mb.
3. Bảng xếp hạng cục bộ
Sau màn hình Bình Minh (thắng Đêm 3) hoặc sau khi thua ở bất kỳ Đêm nào, cho nhập tên để lưu điểm.
Tên: 3–12 ký tự [A-Za-z0-9_]. Hỗ trợ tiếng Việt có dấu là điểm cộng, không bắt buộc.
Mỗi mục lưu: name, score (tổng điểm các Đêm đã thắng), nights_won (0–3), achieved_at (ISO 8601 có múi giờ), seed.
Giữ top 10. Sắp xếp theo score giảm dần; bằng điểm thì ai đạt trước đứng trên.
Lưu trên đĩa cục bộ, vẫn còn sau khi tắt và mở lại game.
Có màn hình Bảng xếp hạng từ menu chính.
Lệnh xuất: <run_cmd> --export-leaderboard out.json cho ra {"entries": [ ... ]} đúng thứ tự.
4. Dễ tiếp cận (accessibility)
Yêu cầu	Chi tiết
Đổi phím	Mọi hành động: di chuyển (4 hướng), nhảy, lướt, tương tác, tỏa sáng, tạm dừng. Phát hiện trùng phím và báo cho người dùng. Có nút "Khôi phục mặc định". Được lưu
Phụ đề / chỉ báo hình ảnh	Bóng Mực xuất hiện (kèm mũi tên chỉ hướng ở mép màn hình), gió sắp thổi, 10 s cuối, đèn có fuel < 30
Giảm chuyển động	Tắt rung camera và hiệu ứng chớp màn hình
Cỡ chữ UI	Tối thiểu 18 px ở 1280×720; tùy chọn chữ lớn (×1.25)
5. Đóng gói & tài liệu
Clone repo sạch → làm theo README tối đa 3 lệnh → chơi được. Giảng viên sẽ thử trên máy sạch.
README.md có: mô tả ngắn, ảnh chụp hoặc GIF, yêu cầu hệ thống, cài đặt, điều khiển, cách chạy test, headless, bench, soak.
CHANGELOG.md có mục cho cả 4 phase. CREDITS.md liệt kê mọi asset, âm thanh và công cụ AI tạo nội dung. Có LICENSE.
GitHub Release v1.0.0 có bản chạy được: file thực thi, thư mục web tĩnh hoặc Docker image kèm hướng dẫn.
6. Test Contract v1.3
contract_version: "1.3".
game.contract.json thêm bench_cmd và soak_cmd.
Mọi yêu cầu của v1.0–v1.2 vẫn giữ nguyên.
7. Retro & demo
Bản retro (1–2 trang, tên và vị trí tự chọn): tổng hợp Evaluation của 4 phase; điều gì hiệu quả hoặc không hiệu quả khi làm với AI; những lần AI sai và cách bạn phát hiện; harness nào (AGENTS.md, skill, hook) giúp nhiều nhất; tổng token/chi phí AI ước tính và bạn đã tiết kiệm token thế nào; nếu làm lại thì đổi gì.
Video demo .mp4 dưới 5 phút (đính kèm Release v1.0.0 hoặc docs/demo/demo.mp4): chơi trực tiếp một đoạn, cho thấy bằng chứng game chạy đúng (test, headless, bench).
Định nghĩa hoàn thành (DoD)
Có bằng chứng game chạy đúng các yêu cầu của phase (định dạng tự chọn).
Tag phase-4 và Release v1.0.0.
bench.json và soak.json do bạn tự chạy được commit vào repo.
Mọi test ẩn Phase 1–3 còn hiệu lực vẫn đạt.
Repo public, có đủ harness AI và tài liệu theo quy định nộp bài.