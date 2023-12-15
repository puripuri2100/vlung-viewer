// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::Read;

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq, Eq)]
struct GroupInfo {
    group: usize,
    length: usize,
}

#[derive(Clone, Debug, Deserialize, Serialize, PartialEq, Eq)]
struct AnalysisData {
    rows: usize,
    columns: usize,
    height: usize,
    group_size: usize,
    data: Vec<Vec<Vec<GroupInfo>>>,
}

fn parse_analysis_data(str: &str) -> Option<AnalysisData> {
    let mut lines = str.split('\n');
    if let Some(size_info) = lines.next() {
        let mut info_lst = size_info.split(' ');
        let rows = info_lst.next().unwrap().parse().unwrap();
        let columns = info_lst.next().unwrap().parse().unwrap();
        let height = info_lst.next().unwrap().parse().unwrap();
        let group_size = info_lst.next().unwrap().parse().unwrap();
        let lines = lines.collect::<Vec<&str>>();
        let mut data = vec![vec![vec![]; columns]; height];
        for i in 0..height {
            let str_lst = &mut lines[((columns + 1) * i)..((columns + 1) * (i + 1))].iter();
            let z = str_lst.next().unwrap().parse::<usize>().unwrap();
            for (y, x_data_str) in str_lst.enumerate() {
                for data_str in x_data_str.split(',') {
                    let mut l = data_str.split('*');
                    let group = l.next().unwrap().parse().unwrap();
                    let length = l.next().unwrap().parse().unwrap();
                    data[z][y].push(GroupInfo { group, length });
                }
            }
        }
        let data = AnalysisData {
            rows,
            columns,
            height,
            group_size,
            data,
        };
        Some(data)
    } else {
        None
    }
}

#[tauri::command]
fn read_file(path: &str) -> Option<AnalysisData> {
    if let Ok(mut file) = File::open(path) {
        let mut buf = Vec::new();
        if file.read_to_end(&mut buf).is_ok() {
            if let Ok(str) = std::string::String::from_utf8(buf) {
                parse_analysis_data(&str)
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
        .invoke_handler(tauri::generate_handler![read_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
