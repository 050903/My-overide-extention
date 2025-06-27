# UTH Course Registration Helper Extension

## 📝 Purpose

This Chrome extension assists students of Ho Chi Minh City University of Transport (UTH) in automating and enhancing the course registration process on the portal.ut.edu.vn website. It streamlines repetitive actions, provides quick information, and improves the overall registration experience.

## 🚀 Main Features

- **Force Registration Open (Client-side):** Change the registration status on the UI (client-side only, cannot bypass server restrictions).
- **Auto Click Registration Buttons:** Automatically click all available "Register" buttons on the page.
- **Restore Data:** Temporarily save and restore registration status from localStorage.
- **Unlock Registration Buttons:** Enable disabled "Register" buttons on the UI (if any).
- **Scan All Class Schedules:** Automatically fetch and display the schedule (time, room, building) for all available classes in a convenient table.
- **Floating Panel UI:** A compact, always-visible panel on the registration page for quick access to all features.
- **Background Monitoring & Notification:** The extension runs in the background (as long as Chrome is running), periodically checks for newly opened classes, and sends desktop notifications (with optional sound) when new registration slots are available.
- **Minimize Panel:** You can minimize the floating panel to avoid blocking the page content.

## ⚙️ Installation

1. Clone or download this extension's source code.
2. Go to `chrome://extensions` in your Chrome browser.
3. Enable "Developer mode".
4. Click "Load unpacked" and select the extension's source folder.
5. Visit [https://portal.ut.edu.vn/coursesregistration](https://portal.ut.edu.vn/coursesregistration) to use the extension.

## 🧑‍💻 Usage

- The floating panel will automatically appear at the bottom right of the course registration page.
- Use the feature buttons:
  - **Force Registration Open:** Change the registration status on the UI (client-side only, does not affect server-side status).
  - **Auto Click Register:** Quickly click all available "Register" buttons.
  - **Restore Data:** Restore previously saved registration status.
  - **Unlock Register Buttons:** Enable any disabled "Register" buttons (if present).
  - **Scan All Schedules:** Display a table of all class schedules (if available from the server).
  - **Minimize Panel:** Click the minimize button to hide the panel content and free up screen space.
- **Background Notification:** The extension will automatically check for new registration slots in the background and notify you even if the registration tab is closed (as long as Chrome is running in the background).

## ⚠️ Notes & Limitations

- The extension **cannot bypass server-side restrictions**. If the server has not opened registration or you are not eligible, all actions only affect the UI and do not change your actual registration status.
- If the server has not published class schedules, the scan feature may return no data.
- The extension does **not** collect, store, or transmit any personal data externally.
- Use only for legitimate purposes to assist with registration, **not** for attacking or disrupting the system.
- For background notifications to work, Chrome must be running (can be minimized or in the system tray).

## 🛡️ Disclaimer

- Any attempt to exploit, attack, or use this extension for illegal purposes is a violation of university and legal regulations.
- The author is **not responsible** for any misuse of this extension.

## 📬 Feedback & Contributions

If you have suggestions, find bugs, or need support, please open an issue or pull request on this repository.

## 📄 License

MIT License

Copyright (c) 2024 Tran The Hao

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 