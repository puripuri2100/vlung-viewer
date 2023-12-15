// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Read;
use tauri::api::dialog::blocking::FileDialogBuilder;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Deserialize, Serialize)]
pub struct Point {
    pub x: u16,
    pub y: u16,
    pub z: u16,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_analysis_data() -> Option<Vec<Vec<Point>>> {
    println!("open!");
    let file_path = FileDialogBuilder::new().pick_file();
    println!("path: {file_path:?}");
    if let Some(path) = file_path {
        if let Ok(mut file) = File::open(path) {
            let mut buf = Vec::new();
            if file.read_to_end(&mut buf).is_ok() {
                if let Ok(value) = serde_json::from_slice(&buf) {
                    Some(value)
                } else {
                    None
                }
            } else {
                None
            }
        } else {
            None
        }
    } else {
        None
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_analysis_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
