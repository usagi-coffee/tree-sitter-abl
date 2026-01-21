package tree_sitter_abl_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_abl "github.com/tree-sitter/tree-sitter-abl/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_abl.Language())
	if language == nil {
		t.Errorf("Error loading abl grammar")
	}
}
