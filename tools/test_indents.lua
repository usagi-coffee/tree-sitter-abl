-- Run with NVIM_TREESITTER_PATH and ABL_PARSER_PATH set; see queries/README.md.
local plugin = assert(vim.env.NVIM_TREESITTER_PATH, "Set NVIM_TREESITTER_PATH")
local parser = assert(vim.env.ABL_PARSER_PATH, "Set ABL_PARSER_PATH")
vim.opt.runtimepath:prepend(plugin)
vim.opt.runtimepath:prepend(vim.fn.getcwd())
vim.treesitter.language.add("abl", { path = parser })
vim.treesitter.language.register("abl", "abl")
vim.treesitter.query.set("abl", "indents", table.concat(vim.fn.readfile("queries/indents.scm"), "\n"))
-- Exercise predicates in Neovim as well as the CLI's Rust query implementation.
for _, name in ipairs({ "highlights", "indents", "tags" }) do
  local query = vim.treesitter.query.parse(
    "abl", table.concat(vim.fn.readfile("queries/" .. name .. ".scm"), "\n")
  )
  for _, path in ipairs(vim.fn.glob("test/highlight/*", false, true)) do
    local source = table.concat(vim.fn.readfile(path), "\n")
    local root = vim.treesitter.get_string_parser(source, "abl"):parse()[1]:root()
    assert(not root:has_error(), path .. ": parse error")
    for _ in query:iter_captures(root, source) do
    end
  end
  if name == "tags" then
    local source = 'RUN VALUE("computed.p").'
    local root = vim.treesitter.get_string_parser(source, "abl"):parse()[1]:root()
    assert(not root:has_error())
    for id in query:iter_captures(root, source) do
      error("Dynamic RUN must not produce a static tag: " .. query.captures[id])
    end
  end
end
local indent = require("nvim-treesitter.indent")
local failures = {}
for _, path in ipairs(vim.fn.glob("test/indent/*", false, true)) do
  local expected = vim.fn.readfile(path)
  local input = vim.tbl_map(function(line)
    return line:gsub("^%s+", "")
  end, expected)
  vim.cmd.enew()
  vim.bo.filetype = "abl"
  vim.bo.shiftwidth = 2
  vim.bo.expandtab = true
  vim.api.nvim_buf_set_lines(0, 0, -1, false, input)
  local tree = vim.treesitter.get_parser(0, "abl"):parse()[1]
  assert(not tree:root():has_error(), path .. ": parse error")
  for row, line in ipairs(expected) do
    local amount = indent.get_indent(row)
    if amount >= 0 and line ~= "" then
      local actual = string.rep(" ", amount) .. input[row]
      vim.api.nvim_buf_set_lines(0, row - 1, row, false, { actual })
      if actual ~= line then
        table.insert(failures, path .. ":" .. row .. ": expected "
          .. #line:match("^%s*") .. " spaces, got " .. amount .. " (" .. input[row] .. ")")
      end
    end
  end
  vim.bo.modified = false
end
if #failures > 0 then
  error(table.concat(failures, "\n"))
end
print("ABL indentation fixtures passed")
vim.cmd.quitall()
