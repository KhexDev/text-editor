// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

use tauri::WindowEvent;

#[tauri::command]
fn set_window_title(window: tauri::Window, title: &str) {
    window
        .set_title(title)
        .expect("Failed to open window title");
}

#[tauri::command]
fn save_file(window: tauri::Window, content: &str) {
    println!("Saving file with content: {}", content);

    let res = rfd::FileDialog::new()
        .add_filter("text", &["txt"])
        .save_file();

    if let Some(path) = res {
        let file_name = path.file_name().unwrap().to_str().unwrap();
        window
            .set_title(file_name)
            .expect("Failed to set window title");

        std::fs::write(path, content).expect("Failed to write file");
    }
}

#[tauri::command]
fn open_file(window: tauri::Window) -> Result<String, String> {
    let res = rfd::FileDialog::new()
        .add_filter("text", &["txt"])
        .pick_file();

    if let Some(path) = res {
        let file_name = path.file_name().unwrap().to_str().unwrap();
        window
            .set_title(file_name)
            .expect("Failed to set window title");

        let content = std::fs::read_to_string(path).expect("Failed to read file");
        Ok(content)
    } else {
        Err("Cant read file".to_string())
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            save_file,
            open_file,
            set_window_title
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
