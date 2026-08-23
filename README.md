# Birthday card – GitHub Pages

Đây là project tĩnh gồm HTML + CSS + JavaScript, không cần Node.js, không cần React.

## Cấu trúc

```text
mai-birthday/
├── index.html
├── style.css
├── script.js
└── assets/
    ├── cake.jpg
    ├── pattern.jpg
    └── memory.jpg
```

## Chạy trên máy

Chỉ cần mở `index.html` bằng trình duyệt.

## Đưa lên GitHub

1. Tạo một repository mới.
2. Upload:
   - `index.html`
   - `style.css`
   - `script.js`
   - thư mục `assets`
3. Vào **Settings → Pages**
4. Ở phần **Build and deployment**, chọn:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/(root)**
5. Save.
6. Chờ GitHub Pages build và mở URL được cung cấp.

## Tại sao nút next hoạt động?

Toàn bộ điều hướng được xử lý trong `script.js`.

Ví dụ:

```js
bindButton("nextButton1", () => showScreen(2));
```

`showScreen()` sẽ tắt `.active` của tất cả màn hình và bật `.active` cho màn hình cần hiển thị.

Không dùng:
- `<a href="...">`
- reload trang
- inline `onclick`
- form submit

Điều này giúp web chạy ổn định trên GitHub Pages.

## Tên ảnh

Các đường dẫn phải khớp đúng chữ hoa/chữ thường:

```text
assets/cake.jpg
assets/pattern.jpg
assets/memory.jpg
```

Nếu em đổi tên ảnh, hãy sửa cả `index.html` và `script.js`.
