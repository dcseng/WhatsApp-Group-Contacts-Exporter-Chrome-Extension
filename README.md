Aqui está o README atualizado com a referência ao código de inspiração:

---

# WhatsApp Group Exporter

**WhatsApp Group Exporter** is a Chrome extension that allows you to export contacts from a WhatsApp Web group chat as a CSV file. The CSV file will include the phone number, name, push name, and the group name for each contact.

## Features

- Automatically capture the group name from the WhatsApp Web interface.
- Export group contacts to a CSV file with customizable separators.
- The CSV file is saved with the group name as the filename.

## Installation

### 1. Clone or Download the Repository

You can clone the repository using Git or download the ZIP file.

```bash
git clone https://github.com/yourusername/whatsapp-group-exporter.git
```

Alternatively, you can download the ZIP file and extract it.

### 2. Open Chrome Extensions

Go to `chrome://extensions/` in your Chrome browser.

### 3. Enable Developer Mode

In the top right corner, toggle the "Developer mode" switch to enable it.

### 4. Load the Extension

Click on "Load unpacked" and select the directory where you cloned or extracted the files.

### 5. Add the Extension to Chrome

The extension will now appear in your Chrome toolbar and on the extensions page.

## How to Use

1. **Open WhatsApp Web**:
   - Log in to WhatsApp Web by scanning the QR code with your phone.
   
2. **Select a Group**:
   - Navigate to the group chat whose contacts you want to export.
   
3. **Export Contacts**:
   - Click on the WhatsApp Group Exporter extension icon in the Chrome toolbar.
   - In the popup, click the "Export Contacts" button.
   - A CSV file will be automatically downloaded, named after the group.

## Files

- **manifest.json**: Configuration file for the Chrome extension.
- **content.js**: Main JavaScript file that handles the contact extraction.
- **popup.html**: HTML file for the extension's popup interface.
- **popup.js**: JavaScript file for handling events in the popup.
- **icon16.png, icon48.png, icon128.png**: Icons for the extension.

## Customization

### Change the CSV Separator

By default, the CSV separator is set to `;`. If you need a different separator (e.g., `,`), you can modify the `content.js` file:

```javascript
const row = values.map((value) => `"${value}"`).join(";"); // Change ";" to ","
```

### Change the Filename Format

If you want to change how the CSV file is named, you can modify the following line in `content.js`:

```javascript
const fileName = `${this.#chatToFind}.csv`; // Customize the filename here
```

## Inspiration

This project was inspired by [mzahidriaz/WhatsAppGroupContactExport.js](https://gist.github.com/mzahidriaz/4c5404fe24e3c6a00d7bd82b3ca328e7). Many thanks to mzahidriaz for the original concept and implementation.

## Troubleshooting

- **No CSV file is downloaded**: Make sure you have selected a group chat on WhatsApp Web before clicking "Export Contacts."
- **Group name is incorrect**: The group name is captured from the WhatsApp Web page. Ensure that the page is fully loaded and that you have the correct XPath in the `content.js` file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

---

This README provides clear instructions and acknowledges the original code that inspired this project.
