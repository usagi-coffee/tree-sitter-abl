import XCTest
import SwiftTreeSitter
import TreeSitterAbl

final class TreeSitterAblTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_abl())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading abl grammar")
    }
}
