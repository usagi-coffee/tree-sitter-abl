//! This crate provides abl language support for the [tree-sitter] parsing library.
//!
//! Typically, you will use the [`LANGUAGE`] constant to add this language to a
//! tree-sitter [`Parser`], and then use the parser to parse some code:
//!
//! ```
//! let code = r#"
//! "#;
//! let mut parser = tree_sitter::Parser::new();
//! let language = tree_sitter_abl::LANGUAGE;
//! parser
//!     .set_language(&language.into())
//!     .expect("Error loading abl parser");
//! let tree = parser.parse(code, None).unwrap();
//! assert!(!tree.root_node().has_error());
//! ```
//!
//! [`Parser`]: https://docs.rs/tree-sitter/0.27.0/tree_sitter/struct.Parser.html
//! [tree-sitter]: https://tree-sitter.github.io/

use tree_sitter_language::LanguageFn;

extern "C" {
    fn tree_sitter_abl() -> *const ();
}

/// The tree-sitter [`LanguageFn`] for this grammar.
pub const LANGUAGE: LanguageFn = unsafe { LanguageFn::from_raw(tree_sitter_abl) };

/// The content of the [`node-types.json`] file for this grammar.
///
/// [`node-types.json`]: https://tree-sitter.github.io/tree-sitter/using-parsers/6-static-node-types
pub const NODE_TYPES: &str = include_str!("../../src/node-types.json");

#[cfg(with_highlights_query)]
/// The syntax highlighting query for this grammar.
pub const HIGHLIGHTS_QUERY: &str = include_str!("../../queries/highlights.scm");

#[cfg(with_injections_query)]
/// The language injection query for this grammar.
pub const INJECTIONS_QUERY: &str = include_str!("../../queries/injections.scm");

#[cfg(with_locals_query)]
/// The local variable query for this grammar.
pub const LOCALS_QUERY: &str = include_str!("../../queries/locals.scm");

#[cfg(with_tags_query)]
/// The symbol tagging query for this grammar.
pub const TAGS_QUERY: &str = include_str!("../../queries/tags.scm");

#[cfg(test)]
mod tests {
    #[test]
    fn test_macro_recovery_has_bounded_lookahead() {
        use std::sync::atomic::{AtomicUsize, Ordering};
        use std::sync::Arc;

        let mut parser = tree_sitter::Parser::new();
        parser.set_language(&super::LANGUAGE.into()).unwrap();
        let consumed = Arc::new(AtomicUsize::new(0));
        let count = consumed.clone();
        parser.set_logger(Some(Box::new(move |kind, message| {
            if kind == tree_sitter::LogType::Lex && message.starts_with("consume character:") {
                count.fetch_add(1, Ordering::Relaxed);
            }
        })));

        // A discarded parse branch probes recovery at DATA-SOURCE. It must not
        // treat the remaining file as a macro payload and scan to EOF each time.
        for repetitions in [64, 128] {
            let source =
                "CLASS X:\n  DEFINE PRIVATE STATIC DATA-SOURCE ds FOR bCust.\nEND.\n"
                    .repeat(repetitions);
            consumed.store(0, Ordering::Relaxed);
            let tree = parser.parse(&source, None).unwrap();
            assert!(!tree.root_node().has_error());
            assert_eq!(tree.root_node().end_byte(), source.len());
            let consumed = consumed.load(Ordering::Relaxed);
            assert!(consumed > 0, "Lexer logging must be enabled");
            assert!(
                consumed < source.len() * 10,
                "Excessive lookahead: {} characters consumed for {} input bytes",
                consumed,
                source.len()
            );
        }
    }

    #[cfg(feature = "wasm-test")]
    #[test]
    fn test_can_load_wasm_grammar() {
        let wasm_path =
            std::path::Path::new(env!("CARGO_MANIFEST_DIR")).join("tree-sitter-abl.wasm");
        let wasm = std::fs::read(wasm_path)
            .expect("Build the WASM grammar first with `bun run build:wasm`");
        let engine = tree_sitter::wasmtime::Engine::default();
        let mut store =
            tree_sitter::WasmStore::new(&engine).expect("Error creating Tree-sitter WASM store");
        let language = store
            .load_language("abl", &wasm)
            .expect("Error loading abl grammar into WASM store");
        assert!(language.is_wasm());
        assert_eq!(store.language_count(), 1);

        let mut parser = tree_sitter::Parser::new();
        parser
            .set_wasm_store(store)
            .expect("Error setting WASM store");
        parser
            .set_language(&language)
            .expect("Error setting abl WASM language");
        let source = "MESSAGE \"Hello, world!\".";
        let tree = parser
            .parse(source, None)
            .expect("Error parsing with WASM grammar");
        let root = tree.root_node();
        assert!(
            !root.has_error(),
            "Unexpected parse errors: {}",
            root.to_sexp()
        );
        assert_eq!(root.end_byte(), source.len());
        assert!(root.named_child_count() > 0);
    }

    #[test]
    fn test_can_load_grammar() {
        let mut parser = tree_sitter::Parser::new();
        parser
            .set_language(&super::LANGUAGE.into())
            .expect("Error loading abl parser");
    }
}
