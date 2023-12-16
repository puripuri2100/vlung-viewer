type group_info = {
  group: number,
  start: number,
  end: number,
}

type analysis_data = {
  rows: number,
  columns: number,
  height: number,
  group_size: number,
  data: group_info[][][],
}
