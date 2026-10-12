use std::{path::PathBuf, time::Instant};

fn wasm() -> Vec<u8> {
    let path = std::env::var_os("ABL_WASM_PATH")
        .map(PathBuf::from)
        .unwrap_or_else(|| PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tree-sitter-abl.wasm"));
    std::fs::read(path).expect("Build the Wasm grammar first with `bun run build:wasm`")
}

fn parser(wasm: &[u8]) -> tree_sitter::Parser {
    let engine = tree_sitter::wasmtime::Engine::default();
    let mut store = tree_sitter::WasmStore::new(&engine).unwrap();
    let language = store
        .load_language("abl", wasm)
        .expect("WasmStore load failed");
    assert_eq!(store.language_count(), 1);
    let mut parser = tree_sitter::Parser::new();
    parser.set_wasm_store(store).unwrap();
    parser.set_language(&language).unwrap();
    parser
}

#[test]
#[ignore = "Run explicitly with --ignored --nocapture for timing"]
fn benchmark_wasm() {
    let mut parser = parser(&wasm());
    let source = include_str!("../../tools/benchmark.p");
    let mut timings = Vec::new();
    for run in 0..8 {
        let start = Instant::now();
        let tree = parser.parse(source, None).unwrap();
        let ms = start.elapsed().as_secs_f64() * 1000.0;
        assert!(!tree.root_node().has_error());
        assert_eq!(tree.root_node().end_byte(), source.len());
        if run > 0 {
            timings.push(ms);
        }
    }
    timings.sort_by(f64::total_cmp);
    let median = timings[timings.len() / 2];
    eprintln!(
        "WASM_BENCHMARK_BYTES={} MEDIAN_MS={median:.3} BYTES_PER_MS={:.2} RUNS={}",
        source.len(),
        source.len() as f64 / median,
        timings.len()
    );
}
