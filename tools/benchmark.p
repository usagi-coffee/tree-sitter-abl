/* conflicts/conflicts.txt: CONFLICT - primary expression vs function call */
x = myFunc(1).
x = obj:method().

/* conflicts/conflicts.txt: CONFLICT - DISPLAY record vs widget-qualified/value */
DISPLAY Customer IN WINDOW w.
DISPLAY Customer EXCEPT Comments WITH FRAME f.
DISPLAY Customer.Name.

/* conflicts/conflicts.txt: CONFLICT - widget entry vs identifier-like values */
ON CHOOSE OF btnFind DO:
  MESSAGE "ok".
END.

/* conflicts/conflicts.txt: CONFLICT - DEFINE modifier prefix matrix */
DEFINE NEW SHARED BUFFER bCust FOR Customer.
DEFINE PRIVATE STATIC VARIABLE v AS INTEGER NO-UNDO.
DEFINE PRIVATE STATIC QUERY q FOR Customer.
CLASS X:
  DEFINE PRIVATE STATIC DATA-SOURCE ds FOR bCust.
  DEFINE PRIVATE STATIC DATASET dsOrder FOR ttOrder.
  DEFINE PRIVATE STATIC TEMP-TABLE tt FIELD id AS INTEGER.
  DEFINE PRIVATE STATIC PROPERTY p AS INTEGER NO-UNDO GET. SET.
  DEFINE PRIVATE STATIC EVENT onChanged SIGNATURE VOID ().
END.

/* conflicts/conflicts.txt: CONFLICT - property/event/variable modifier overlap */
CLASS X:
  DEFINE PROTECTED ABSTRACT OVERRIDE EVENT onAbstract SIGNATURE VOID (INPUT reason AS CHARACTER).
END.
DEFINE PACKAGE-PRIVATE VARIABLE vPkg AS INTEGER NO-UNDO.

/* conflicts/conflicts.txt: CONFLICT - unsubscribe body vs identifier expression */
UNSUBSCRIBE PROCEDURE hSub TO cEvent.
UNSUBSCRIBE TO "MyEvent" IN hPub.

/* conflicts/coverage.txt: CONFLICT - primary_expression vs function_call */
x = myFunc(1).

/* conflicts/coverage.txt: CONFLICT - display record vs widget-qualified/primary expression */
DISPLAY Customer IN WINDOW w.

/* conflicts/coverage.txt: CONFLICT - widget_entry ambiguous with identifier-like forms */
ON CHOOSE OF btnFind DO:
END.

/* conflicts/coverage.txt: CONFLICT - define modifier prefix matrix (buffer/property/data-source/dataset/event/query/temp-table/variable) */
DEFINE NEW SHARED BUFFER bCust FOR Customer.
DEFINE PRIVATE STATIC VARIABLE v AS INTEGER NO-UNDO.
DEFINE PRIVATE STATIC QUERY q FOR Customer.
CLASS X:
  DEFINE PRIVATE STATIC DATA-SOURCE ds FOR bCust.
  DEFINE PRIVATE STATIC DATASET dsOrder FOR ttOrder.
  DEFINE PRIVATE STATIC TEMP-TABLE tt FIELD id AS INTEGER.
  DEFINE PRIVATE STATIC PROPERTY p AS INTEGER NO-UNDO GET. SET.
  DEFINE PRIVATE STATIC EVENT onChanged SIGNATURE VOID ().
END.

/* conflicts/coverage.txt: CONFLICT - property_access_modifier vs event_access_modifier */
CLASS X:
  DEFINE PUBLIC PROPERTY p AS INTEGER NO-UNDO GET. SET.
  DEFINE PUBLIC EVENT onE SIGNATURE VOID ().
END.

/* conflicts/coverage.txt: CONFLICT - property_access_modifier vs dataset/temp-table/variable modifiers */
CLASS X:
  DEFINE PRIVATE PROPERTY p AS INTEGER NO-UNDO GET. SET.
END.
DEFINE PRIVATE VARIABLE v AS INTEGER NO-UNDO.
DEFINE PRIVATE DATASET ds FOR ttOrder.
DEFINE PRIVATE TEMP-TABLE tt FIELD id AS INTEGER.

/* conflicts/coverage.txt: CONFLICT - property_access_modifier vs variable_modifier */
CLASS X:
  DEFINE PROTECTED PROPERTY p AS INTEGER NO-UNDO GET. SET.
END.
DEFINE PROTECTED VARIABLE v AS INTEGER NO-UNDO.

/* conflicts/coverage.txt: CONFLICT - property_access_modifier vs event_access_modifier vs variable_modifier */
CLASS X:
  DEFINE PACKAGE-PRIVATE PROPERTY p AS INTEGER NO-UNDO GET. SET.
  DEFINE PACKAGE-PRIVATE EVENT onPkg SIGNATURE VOID ().
END.
DEFINE PACKAGE-PRIVATE VARIABLE vPkg AS INTEGER NO-UNDO.

/* conflicts/coverage.txt: CONFLICT - buffer/property_class/data_source_static/event_type/query/variable modifiers overlap */
DEFINE PRIVATE STATIC BUFFER bCust FOR Customer.
DEFINE PRIVATE STATIC QUERY q FOR Customer.
DEFINE PRIVATE STATIC VARIABLE v AS INTEGER NO-UNDO.
CLASS X:
  DEFINE PRIVATE STATIC DATA-SOURCE ds FOR bCust.
END.

/* conflicts/coverage.txt: CONFLICT - property_class_modifier vs event_type_modifier */
CLASS X:
  DEFINE ABSTRACT PROPERTY p AS INTEGER NO-UNDO GET. SET.
  DEFINE ABSTRACT EVENT onAbs SIGNATURE VOID ().
END.

/* conflicts/coverage.txt: CONFLICT - unsubscribe body vs identifier-like expression */
UNSUBSCRIBE PROCEDURE hSub TO cEvent.

/* core/accessors.txt: ACCESSORS */
table.field.
Type::Member.
obj?:prop.
obj:method(1, 2).
Func().
some_object:root.
some_object :root.
some_object:chained_property:chained_another:method().
oObject:Length -= String(pcMessage):Size.
new MyClass():Size.
SESSION:NUMERIC-FORMAT = 'EUROPEAN'.
THIS-PROCEDURE:PRIVATE-DATA.

/* core/accessors.txt: ACCESSORS - assignment variants */
hUS::SessionStatus = "Active".
zmd_key1:label = getTermLabel("X",15).
HTT = TEMP-TABLE ttPH:HANDLE.
interface = zmd_wkfl.zmd_chr02.
object :property = 5.

/* core/argument-reference.txt: ARGUMENT REFERENCE */
DEF {1} VAR x AS INTEGER.
x = {2}.

/* core/argument-reference.txt: ARGUMENT REFERENCE positional and all arguments */
{1}.
{*}.

/* core/array-access.txt: ARRAY ACCESS */
arr[1].
arr[1, 2].
arr[1 FOR 4].

/* core/assignment.txt: AUGMENTED ASSIGNMENT */
x += 1.
x -= 2.
x *= 3.
x /= 4.

/* core/assignment.txt: ASSIGNMENT */
x = 5.
obj:prop = "ok".
x = 1 + 2.
x = ?.
x = +5.
x = 1.31.2022.
x = 42 NO-ERROR.
obj:prop = "value" FIELD Cust.Name IN FRAME frm.

/* core/comments.txt: COMMENT */
/* comment */
// comment
/***
 TRIPLE-STAR MULTILINE
 ***/

/* core/include.txt: INCLUDE positional arguments */
{include_positional.i arg1 arg2 "NEW"}

/* core/include.txt: INCLUDE named arguments */
{include_named.i &arg2="test" &ABC=variable}

/* core/include.txt: INCLUDE preprocessor file prefix with positional argument */
{{&US_ET}etdcrvar.i new}

/* core/include.txt: INCLUDE preprocessor file prefix only */
{{&INC}file.i}

/* core/include.txt: INCLUDE file from argument reference */
{{1}}

/* core/include.txt: INCLUDE multiline named arguments */
{{&INC}file_with_args.i
  &PARM1=var_one &PARM2=var_two
  &SITE=tbl_one.col_one &LOC=tbl_one.col_two
  &ORDER=param_order
  &ITEM=param_item &QTY=qty_val &LOT='N' &PRICE=price_val
}

/* core/include.txt: INCLUDE with WINDOW positional argument */
{us/mf/mfselbpr.i window 132}

/* core/literals.txt: CONSTANT */
{&VAR1}.

/* core/literals.txt: BOOLEAN LITERAL */
TRUE.
FALSE.
YES.
NO.

/* core/operators.txt: LOGICAL AND COMPARISON */
x = 1.
flag = x > 2 AND x < 5.
ok = x EQ 2 OR x NE 3.
w = -(0).
x = -f().
y = -table.field.
z = -obj:method().
z = NOT y.
y = NOT -x < -10 OR x = 10.
s = code BEGINS "AB".
s = code MATCHES "*|*".
x = repYear MODULO 4.

/* core/operators.txt: ARITHMETIC PRECEDENCE AND ASSOCIATIVITY */
x = 2 + 2.
y = (4 * 3) / 2.
z = 2 > 4.
x = 1 + 2 * 3.
x = (1 + 2) * 3.
x = 10 / 2 * 5.
x = 10 - 2 - 3.

/* core/operators.txt: LOGICAL BOOLEAN LITERALS */
w = YES.
x = NO.
x = YES AND NO.
x = YES OR NO.

/* core/operators.txt: LOGICAL NOT PRECEDENCE */
z = NOT y > 5.
y = NOT 2 + 2.
z = NOT 2 + 2 = 5.
zr = NOT 5 = 2 + 2.
x = NOT (y > 5).

/* core/operators.txt: UNARY NESTING */
x = - -1.
x = -(-1 + 2).
x = - -f().

/* core/operators.txt: ARITHMETIC ASSOCIATIVITY */
a = 1 + 2 * 3 + 4.
b = 10 / 2 * 5 / 2.

/* core/operators.txt: BOOLEAN ASSOCIATIVITY */
c = YES OR NO AND YES.
d = 1 = 2 OR 3 = 4 AND 5 = 6.

/* core/operators.txt: NOT PRECEDENCE WITH COMPARISON */
e = NOT 1 = 2 AND 3 = 4.

/* core/operators.txt: CHAINED COMPARISON */
f = 1 < 2 < 3.
g = (1 < 2) < 3.

/* core/operators.txt: MIXED PRECEDENCE */
h = 1 + 2 * 3 < 4 OR 5 = 6 AND 7 <> 8.
i = 1 + 2 * 3 = 7.
j = 1 + 2 * 3 = 7 OR 0 = 1 AND 2 = 3.

/* core/operators.txt: INPUT EXPRESSIONS */
x = INPUT field1.
y = INPUT FRAME fr field2.
z = func(INPUT FRAME fr field2).
w = func(INPUT field1:sub).
s = INPUT FRAME fr SESSION:NUMERIC-FORMAT.

/* core/preprocessor.txt: PREPROCESSOR GLOBAL-DEFINE */
&GLOBAL-DEFINE APP-NAME "demo"

/* core/preprocessor.txt: PREPROCESSOR GLOBAL-DEFINE with path value */
&GLOBAL-DEFINE ZM_INC /zmd/dev/INC/

/* core/preprocessor.txt: PREPROCESSOR SCOPED-DEFINE */
&SCOPED-DEFINE FLAG YES
&Scoped-define OPEN-QUERY-DEFAULT-FRAME OPEN QUERY DEFAULT-FRAME FOR EACH ITEM ~
      WHERE item.system_id = ipcItemSysid AND ~
item.item = ipcItem NO-LOCK.
&Scoped-define TABLES-IN-QUERY-DEFAULT-FRAME ITEM

/* core/preprocessor.txt: PREPROCESSOR UNDEFINE */
&UNDEFINE FLAG

/* core/preprocessor.txt: PREPROCESSOR MESSAGE */
&MESSAGE "hello"

/* core/preprocessor.txt: PREPROCESSOR IF DIRECTIVES - single-line forms */
&IF DEFINED (FLAG) EQ 0 &THEN
&IF TRUE
&THEN
&ELSEIF FALSE
&ELSE
&ENDIF

/* core/preprocessor.txt: PREPROCESSOR IF DIRECTIVES - mixed with statements */
&if DEFINED(is_Running) <> 0 &THEN
  DEFINE VARIABLE cParm AS CHARACTER.
&ELSE
  DEFINE INPUT PARAMETER cParm AS CHARACTER.
&ENDIF

/* core/punctuation-terminators.txt: PUNCTUATION AND TERMINATORS */
?;
obj?:prop;
arr[1, 2];

/* phrases/aggregate.txt: ACCUMULATE - TOTAL and BY */
ACCUMULATE price (TOTAL LABEL "Total" BY category).

/* phrases/assign.txt: ASSIGN phrase */
ASSIGN x = 1 y = 2.

/* phrases/at.txt: FORM AT column */
FORM "Label" AT 10.

/* phrases/at.txt: FORM AT row column */
FORM "Label" AT ROW 2 COLUMN 3.

/* phrases/color.txt: MESSAGE COLOR */
MESSAGE COLOR 5 "x".

/* phrases/color.txt: MESSAGE COLOR VALUE */
MESSAGE COLOR VALUE(5) "x".

/* phrases/color.txt: COLOR - legacy slash notation (foreground/background) */
MESSAGE COLOR white/red "Text".

/* phrases/combo-box.txt: VIEW-AS COMBO-BOX */
DEFINE VARIABLE v AS CHARACTER VIEW-AS COMBO-BOX LIST-ITEMS "a", "b" SIZE 10 BY 1 AUTO-COMPLETION UNIQUE-MATCH.

/* phrases/editing.txt: PROMPT-FOR EDITING */
PROMPT-FOR x EDITING: BELL. END.

/* phrases/editor.txt: VIEW-AS EDITOR */
DEFINE VARIABLE v AS CHARACTER VIEW-AS EDITOR SIZE 10 BY 2 SCROLLBAR-VERTICAL.

/* phrases/editor.txt: EDITOR - INNER-LINES/INNER-CHARS */
DEFINE VARIABLE x AS CHARACTER VIEW-AS EDITOR INNER-LINES 5 INNER-CHARS 60.
DEFINE VARIABLE x AS CHARACTER VIEW-AS EDITOR INNER-CHARS 60 INNER-LINES 5.

/* phrases/format.txt: FORMAT phrase */
DEFINE VARIABLE x AS CHARACTER FORMAT "x(10)" LABEL "Name".

/* phrases/format.txt: FORMAT phrase with identifier-like targets */
PUT x FORMAT decF.
PUT x FORMAT f.v.
PUT x FORMAT hFmt:Value.

/* phrases/frame.txt: FRAME phrase */
DISPLAY x WITH FRAME f NO-LABELS.

/* phrases/frame.txt: FRAME phrase with ATTR-SPACE */
FORM a COLON 20 WITH FRAME fA ROW 3 SIDE-LABELS ATTR-SPACE.
FORM a COLON 20 WITH FRAME fA WITH ROW 3 SIDE-LABELS.
FORM a COLON 20 WITH FRAME fA ROW 3 SIDE-LABEL ATTR-SPACE.
FORM a COLON 25 WITH SIZE 79 BY 11 NO-LABEL THREE-D CENTERED.
FORM a COLON 25 WITH SIZE 79 BY 11 NO-LABEL THREE-D CENTER.

/* phrases/frame.txt: FRAME phrase with color attributes */
DISPLAY x WITH DCOLOR 1 FGCOLOR 2 BGCOLOR wClrBg PFCOLOR wClrPf.

/* phrases/frame.txt: FRAME phrase with NO-ATTR-SPACE */
DISPLAY x WITH FRAME f WIDTH 10 NO-BOX NO-ATTR-SPACE.

/* phrases/frame.txt: FRAME phrase with TITLE color options */
DISPLAY x WITH TITLE DCOLOR wClrTit '[ Hello ]'.

/* phrases/frame.txt: FRAME phrase with NO-UNDERLINE */
DISPLAY x WITH NO-UNDERLINE NO-BOX.

/* phrases/frame.txt: FRAME phrase with SCROLLABLE, TOP-ONLY, NO-HELP */
DISPLAY x WITH SCROLLABLE TOP-ONLY NO-HELP.

/* phrases/frame.txt: FRAME phrase with CANCEL-BUTTON and DEFAULT-BUTTON */
DISPLAY x WITH CANCEL-BUTTON btnCancel DEFAULT-BUTTON btnOk.

/* phrases/frame.txt: FRAME - NO-VALIDATE */
DISPLAY x WITH FRAME f NO-VALIDATE.

/* phrases/frame.txt: FRAME - COLOR phrase */
DISPLAY x WITH FRAME f COLOR VALUE(5).
DISPLAY x WITH FRAME f COLOR DISPLAY VALUE(5) PROMPT VALUE(3).

/* phrases/image.txt: IMAGE phrase */
DEFINE IMAGE img FILE "a.png" IMAGE-SIZE 1 BY 2 FROM X 1 Y 2.

/* phrases/in-window.txt: IN WINDOW phrase */
MESSAGE "x" IN WINDOW win.

/* phrases/on-endkey.txt: ON ENDKEY */
DO ON ENDKEY UNDO, LEAVE: END.
DO ON END-KEY UNDO, LEAVE: END.

/* phrases/on-error.txt: ON ERROR */
DO ON ERROR UNDO, THROW: END.

/* phrases/on-error.txt: ON ERROR - bare UNDO (no action) */
DO ON ERROR UNDO: END.

/* phrases/on-quit.txt: ON QUIT */
DO ON QUIT UNDO, LEAVE: END.

/* phrases/on-stop.txt: ON STOP */
DO ON STOP UNDO, LEAVE: END.

/* phrases/preselect.txt: DO PRESELECT */
DO PRESELECT EACH Customer NO-LOCK: END.

/* phrases/query-tuning.txt: QUERY-TUNING */
DO QUERY-TUNING(CACHE-SIZE 10 DEBUG SQL NO-DEBUG): END.

/* phrases/radio-set.txt: VIEW-AS RADIO-SET */
DEFINE VARIABLE v AS LOGICAL VIEW-AS RADIO-SET RADIO-BUTTONS "A", 1.

/* phrases/record.txt: PRESELECT record-phrase */
PRESELECT EACH Customer NO-LOCK.

/* phrases/selection-list.txt: VIEW-AS SELECTION-LIST */
DEFINE VARIABLE v AS CHARACTER VIEW-AS SELECTION-LIST SIZE 20 BY 5 MULTIPLE SCROLLBAR-VERTICAL NO-DRAG LIST-ITEMS "A", "B" SORT.

/* phrases/size.txt: SIZE phrase */
DEFINE VARIABLE v AS CHARACTER VIEW-AS FILL-IN SIZE 10 BY 1.

/* phrases/slider.txt: VIEW-AS SLIDER */
DEFINE VARIABLE v AS INTEGER VIEW-AS SLIDER MAX-VALUE 10 MIN-VALUE 1 TIC-MARKS BOTH FREQUENCY 2.

/* phrases/stop-after.txt: STOP-AFTER */
DO STOP-AFTER 10: END.

/* phrases/trigger.txt: TRIGGERS */
DEFINE VARIABLE v AS CHARACTER TRIGGERS: ON GO DO: END. END TRIGGERS.
DEFINE VARIABLE v2 AS CHARACTER TRIGGERS: ON "RETURN", 13 DO: END. END TRIGGERS.

/* phrases/view-as.txt: VIEW-AS variants */
DEFINE VARIABLE a AS CHARACTER VIEW-AS TEXT.
DEFINE VARIABLE b AS LOGICAL VIEW-AS TOGGLE-BOX.
DEFINE VARIABLE c AS CHARACTER VIEW-AS FILL-IN NATIVE SIZE 10 BY 1.

/* phrases/widget.txt: WIDGET phrase */
HIDE FRAME f.
HIDE MENU m.
HIDE CURRENT-WINDOW.

/* precedences/coverage.txt: PRECEDENCE 01 - operator ladder unary/multiplication/add/compare/not/logical */
x = NOT a + b * c = d OR e = f.

/* precedences/coverage.txt: PRECEDENCE 02 - binary expression in statement expression slots */
MESSAGE a + b.

/* precedences/coverage.txt: PRECEDENCE 03 - os function_call over os filename target */
OS-APPEND myFunc() target.

/* precedences/coverage.txt: PRECEDENCE 04 - dataset function_call over dataset_reference */
ASSIGN c = DATASET myFunc:HANDLE.

/* precedences/coverage.txt: PRECEDENCE 05 - browse enable field function_call disambiguation */
DEFINE BROWSE b1 QUERY q1 DISPLAY myFunc() ENABLE field1.

/* precedences/coverage.txt: PRECEDENCE 06 - include statement over primary expression start */
{inc.i}
a = 1.

/* precedences/coverage.txt: PRECEDENCE 07 - create buffer over object_access handle type */
CREATE BUFFER hBuf FOR TABLE Customer.

/* precedences/coverage.txt: PRECEDENCE 08 - create temp-table over object_access handle type */
CREATE TEMP-TABLE tt.

/* precedences/coverage.txt: PRECEDENCE 09 - create buffer target over identifier */
CREATE BUFFER hBuf FOR TABLE Customer IN WIDGET-POOL wp.

/* precedences/coverage.txt: PRECEDENCE 10 - delete alias over generic delete */
DELETE ALIAS myalias NO-ERROR.

/* precedences/coverage.txt: PRECEDENCE 11 - delete widget-pool over generic delete */
DELETE WIDGET-POOL wp.

/* precedences/coverage.txt: PRECEDENCE 12 - case OR WHEN list separator over binary expression */
CASE x:
  WHEN a OR WHEN b THEN MESSAGE "m".
END CASE.

/* precedences/coverage.txt: PRECEDENCE 13 - assign keyword identifier over widgets */
ASSIGN FRAME = FRAME foo:HANDLE.

/* precedences/coverage.txt: PRECEDENCE 14 - assign object_access over assign keyword identifier */
ASSIGN x = FRAME foo:HANDLE.

/* precedences/coverage.txt: PRECEDENCE 15 - assign object_access_widget over assign keyword identifier */
ASSIGN x = MENU-ITEM m1:SENSITIVE.

/* precedences/coverage.txt: PRECEDENCE 16 - assign record body over assignable */
ASSIGN Customer EXCEPT Name.

/* precedences/coverage.txt: PRECEDENCE 17 - assign function_call over assignable */
ASSIGN SomeFunc() = 1.

/* precedences/coverage.txt: PRECEDENCE 18 - assign statement over generic assignment statement */
ASSIGN a = 1.

/* precedences/coverage.txt: PRECEDENCE 19 - set field over set record */
SET Customer WITH FRAME f.

/* precedences/coverage.txt: PRECEDENCE 20 - enable item over primary expression */
ENABLE field1 FORMAT "x(10)" WHEN ok.

/* precedences/coverage.txt: PRECEDENCE 21 - display record over primary expression */
DISPLAY Customer EXCEPT Comments.

/* precedences/coverage.txt: PRECEDENCE 22 - display record over identifier_or_qualified_name */
DISPLAY Customer WITH BROWSE b.

/* precedences/coverage.txt: PRECEDENCE 23 - display browse body over frame identifier */
DISPLAY Customer EXCEPT Comments WITH BROWSE b1.

/* precedences/coverage.txt: PRECEDENCE 24 - display field over function_call */
DISPLAY Customer.Name.

/* precedences/coverage.txt: PRECEDENCE 25 - display skip phrase over function_call */
DISPLAY SKIP(1) Customer.Name.

/* precedences/coverage.txt: PRECEDENCE 26 - display space phrase over function_call */
DISPLAY SPACE(2) Customer.Name.

/* precedences/coverage.txt: PRECEDENCE 27 - display skip phrase over primary expression */
DISPLAY SKIP(1) x.

/* precedences/coverage.txt: PRECEDENCE 28 - display space phrase over primary expression */
DISPLAY SPACE(2) x.

/* precedences/coverage.txt: PRECEDENCE 29 - display field over display record */
DISPLAY Customer.Name IN WINDOW hWin.

/* precedences/coverage.txt: PRECEDENCE 30 - display item skip over frame skip */
DISPLAY x SKIP y.

/* precedences/coverage.txt: PRECEDENCE 31 - frame_phrase over display_field */
DISPLAY menu WITH TITLE "t".

/* precedences/coverage.txt: PRECEDENCE 32 - frame_phrase over display_items */
DISPLAY x WITH FRAME f.

/* precedences/coverage.txt: PRECEDENCE 33 - frame_phrase over identifier */
DISPLAY x WITH NO-BOX.

/* precedences/coverage.txt: PRECEDENCE 34 - display keyword identifier over widgets */
DISPLAY menu.

/* precedences/coverage.txt: PRECEDENCE 35 - widget entry over primary expression */
ON CHOOSE OF btnFind DO:
END.

/* precedences/coverage.txt: PRECEDENCE 36 - function_call over widget entry */
RUN internalProc IN myFunc().

/* precedences/coverage.txt: PRECEDENCE 37 - widget handle over widget entry */
ON CHOOSE OF btnFind DO:
  MESSAGE "ok".
END.

/* precedences/coverage.txt: PRECEDENCE 38 - widget qualified name over object_access */
ASSIGN MENU-ITEM m1:SENSITIVE IN MENU mymenu = TRUE.

/* precedences/coverage.txt: PRECEDENCE 39 - widget qualified name over primary expression */
DISPLAY x IN FRAME f.

/* precedences/coverage.txt: PRECEDENCE 40 - message expression over widget tokens */
MESSAGE MENU.

/* precedences/coverage.txt: PRECEDENCE 41 - aggregate where phrase over record phrase */
FOR EACH customer WHERE customer.custnum > 0 BY customer.custnum:
  DISPLAY customer.custnum.
END.

/* precedences/coverage.txt: PRECEDENCE 42 - format target over primary expression */
PUT x FORMAT ("x(10)").

/* precedences/coverage.txt: PRECEDENCE 43 - format target over identifier_or_qualified_name */
PUT x FORMAT decF.

/* precedences/coverage.txt: PRECEDENCE 44 - format target over function_call */
PUT x FORMAT hFmt:Value.

/* precedences/coverage.txt: PRECEDENCE 45 - put expression item over format colon/to */
PUT a TO b.

/* precedences/coverage.txt: PRECEDENCE 46 - prompt-for field over prompt-for record */
PROMPT-FOR Customer.Name WITH FRAME f.

/* precedences/coverage.txt: PRECEDENCE 47 - prompt-for identifier over prompt-for record */
PROMPT-FOR Customer WITH FRAME f.

/* precedences/coverage.txt: PRECEDENCE 48 - export statement over export expression */
EXPORT a.

/* precedences/coverage.txt: PRECEDENCE 49 - input expression over input named parameter body */
COLOR PROMPT INPUT field1 field2.

/* precedences/coverage.txt: PRECEDENCE 50 - function_call over input expression body */
INPUT THROUGH prog myFunc().

/* precedences/coverage.txt: PRECEDENCE 51 - input-through arg value over identifier_or_qualified_name */
INPUT THROUGH prog arg1.

/* precedences/coverage.txt: PRECEDENCE 52 - function_call over input-through arg value */
INPUT THROUGH prog myFunc().

/* precedences/coverage.txt: PRECEDENCE 53 - input expression over identifier */
RUN STORED-PROCEDURE p (INPUT x = 1).

/* precedences/coverage.txt: PRECEDENCE 54 - run stored-procedure param over parenthesized expression */
RUN STORED-PROCEDURE sp_Insert (INPUT "John", INPUT 25).

/* precedences/coverage.txt: PRECEDENCE 55 - function_call over run context value */
RUN internalProc IN myFunc().

/* precedences/coverage.txt: PRECEDENCE 56 - subscribe function_call over subscribe expression */
SUBSCRIBE TO myFunc() IN hPub.

/* precedences/coverage.txt: PRECEDENCE 57 - subscribe body over identifier_or_qualified_name */
SUBSCRIBE PROCEDURE hSub TO "evt" IN hPub.

/* precedences/coverage.txt: PRECEDENCE 58 - update field target over update record */
UPDATE Customer WITH FRAME f.

/* precedences/precedences.txt: PRECEDENCE - Binary operator ladder */
x = 1 + 2 * 3.
y = NOT a = b OR c = d.

/* precedences/precedences.txt: PRECEDENCE - ASSIGN disambiguation */
ASSIGN FRAME = FRAME foo:HANDLE.
ASSIGN Customer EXCEPT Name NO-ERROR.
ASSIGN SomeFunc() = 1.

/* precedences/precedences.txt: PRECEDENCE - BROWSE enable function call */
DEFINE QUERY q FOR Customer.
DEFINE BROWSE b1 QUERY q1 DISPLAY CustNum Name.

/* precedences/precedences.txt: PRECEDENCE - CASE OR WHEN separator */
CASE x:
  WHEN a OR WHEN b THEN MESSAGE "m".
END CASE.

/* precedences/precedences.txt: PRECEDENCE - CREATE statement forms */
CREATE BUFFER hBuf FOR TABLE Customer IN WIDGET-POOL wp.
CREATE TEMP-TABLE tt.

/* precedences/precedences.txt: PRECEDENCE - DATASET reference vs function call */
ASSIGN c = dataset BDebtorShipTo:handle.

/* precedences/precedences.txt: PRECEDENCE - DELETE specialized statements */
DELETE ALIAS myalias NO-ERROR.
DELETE WIDGET-POOL wp.

/* precedences/precedences.txt: PRECEDENCE - DISPLAY ambiguity matrix */
DISPLAY Customer WITH BROWSE b.
DISPLAY Customer.Name.
DISPLAY SPACE(2) Customer.Name SKIP(1) Customer.City.
DISPLAY outParam LABEL "Updated" SKIP newParam.
DISPLAY menu WITH TITLE "t".
DISPLAY menu.
DISPLAY Customer.Name IN WINDOW hWin WITH FRAME f1 NO-ERROR.

/* precedences/precedences.txt: PRECEDENCE - ENABLE expression item */
ENABLE field1.
ENABLE field1 FORMAT "x(10)" WHEN ok.

/* precedences/precedences.txt: PRECEDENCE - EXPORT statement binding */
EXPORT a.

/* precedences/precedences.txt: PRECEDENCE - FORMAT phrase disambiguation */
PUT x FORMAT ("x(10)").
PUT x FORMAT decF.
SET field1 FORMAT "x(10)" WHEN ok.

/* precedences/precedences.txt: PRECEDENCE - INCLUDE as statement */
{inc.i}
a = 1.

/* precedences/precedences.txt: PRECEDENCE - INPUT family disambiguation */
RUN STORED-PROCEDURE p (INPUT x = 1).
INPUT THROUGH prog arg1.
INPUT THROUGH prog myFunc().
COLOR PROMPT INPUT field1 field2.

/* precedences/precedences.txt: PRECEDENCE - MESSAGE widget keyword value */
MESSAGE MENU.

/* precedences/precedences.txt: PRECEDENCE - OS filename expressions */
OS-APPEND myFunc() target.
OS-DELETE VALUE(cFile).

/* precedences/precedences.txt: PRECEDENCE - PROMPT-FOR field vs record */
PROMPT-FOR Customer.Name WITH FRAME f.
PROMPT-FOR Customer WITH FRAME f.

/* precedences/precedences.txt: PRECEDENCE - PUT TO binds to item */
PUT a TO b.

/* precedences/precedences.txt: PRECEDENCE - RECORD phrase where option */
FOR EACH customer WHERE customer.custnum > 0 BY customer.custnum:
  DISPLAY customer.custnum.
END.

/* precedences/precedences.txt: PRECEDENCE - RUN STORED-PROCEDURE and run context */
RUN STORED-PROCEDURE sp_Insert (INPUT "John", INPUT 25).
RUN internalProc IN myFunc().

/* precedences/precedences.txt: PRECEDENCE - SET field vs record */
SET Customer WITH FRAME f.
SET Customer.Name WITH FRAME f.

/* precedences/precedences.txt: PRECEDENCE - SUBSCRIBE expression and body */
SUBSCRIBE TO myFunc() IN hPub.
SUBSCRIBE PROCEDURE hSub TO "evt" IN hPub.

/* precedences/precedences.txt: PRECEDENCE - UPDATE field vs record */
UPDATE Customer WITH FRAME f.
UPDATE Customer.Name WITH FRAME f.

/* precedences/precedences.txt: PRECEDENCE - Widget phrase disambiguation */
ON CHOOSE OF btnFind DO:
  MESSAGE "ok".
END.
ON CHOOSE OF btnFind DO:
END.
ASSIGN MENU-ITEM m1:SENSITIVE IN MENU mymenu = TRUE.
DISPLAY x IN FRAME f.

/* quirks.txt: WHITESPACE DOES NOT MATTER */
DO
:
x
= 5; END
.

/* quirks.txt: KEYWORD AS IDENTIFIERS */
DEF VAR Definex as int.
DEF VAR int as int.

/* quirks.txt: KEYWORD PREFIX IDENTIFIERS */
display1 = 2.
define2 = 3.
and3 = 4.
or4 = 5.
formattedDate = test.

choose_label: REPEAT:
  MESSAGE "ok".
END.

preselect_label : REPEAT:
  MESSAGE "ok".
END.

/* quirks.txt: WEIRD WHITESPACE */
PAUSE.
RETURN.

IF flag
THEN
.

IF other THEN
UNDO,
THROW NEW Progress.Lang.AppError("x", 1).

/* quirks.txt: DOT AS BLOCK START */
define variable iEntries     as integer no-undo initial 4.
define variable iLine        as integer no-undo.

do iLine = 1 to iEntries - 1.
  message iLine.
end.

FOR EACH Customer NO-LOCK .
  DISPLAY Customer.Name.
END.

REPEAT .
  DISPLAY "loop".
END.

/* statements/accumulate.txt: ACCUMULATE */
FOR EACH Customer NO-LOCK:
  ACCUMULATE Customer.CreditLimit (AVERAGE COUNT MAXIMUM).
END.

FOR EACH Customer NO-LOCK:
  DISPLAY Customer.CustNum
          Customer.Name (COUNT MAXIMUM MINIMUM)
          Customer.Balance (TOTAL MAXIMUM MINIMUM AVERAGE).
END.

FOR EACH Customer NO-LOCK BREAK BY Customer.SalesRep BY Customer.Country:
  ACCUMULATE Customer.Balance (TOTAL BY Customer.SalesRep BY Customer.Country).
END.

FOR EACH Item NO-LOCK:
  ACCUMULATE Item.OnHand * Item.Price (SUB-TOTAL SUB-COUNT SUB-AVERAGE).
END.

FOR EACH Order NO-LOCK:
  ACCUMULATE Order.Total (TOTAL) Order.OrderDate (COUNT).
END.

FOR EACH Customer NO-LOCK BREAK BY Customer.Country:
  ACCUMULATE Customer.Balance (TOTAL BY Customer.Country)
             Customer.CreditLimit (MAXIMUM).
END.

/* statements/aggregate.txt: AGGREGATE */
AGGREGATE iCount = COUNT(CustNum) FOR Customer.
AGGREGATE dTotal = TOTAL(Balance) iCount = COUNT(CustNum) FOR Customer.
AGGREGATE dAvg = AVERAGE(Amount) FOR Order WHERE Status = "A".
AGGREGATE iMax = MAXIMUM(Qty) iMin = MINIMUM(Qty) FOR OrderLine.
AGGREGATE Stats.TotalBalance = TOTAL(Customer.Balance) FOR Customer WHERE Customer.Active = TRUE.
AGGREGATE iCount = COUNT(CustNum) FOR Customer WHERE CustNum > 0.

/* statements/aggregate.txt: AGGREGATE with qualified field and compound WHERE */
AGGREGATE dTotal = TOTAL(Customer.Balance) FOR Customer WHERE Country EQ "USA" AND City EQ "Los Angeles".

/* statements/annotation.txt: ANNOTATION */
@My-Annotation.
@MyAnnotation(attribute="value",other-attr="two").
@_private(attr="x", attr2="y").

/* statements/apply.txt: APPLY statement - basic */
APPLY "CHOOSE".
APPLY "CHOOSE" TO order-but.
APPLY LASTKEY.
APPLY "ERROR".

/* statements/apply.txt: APPLY statement with different event types */
APPLY "CHOOSE" TO button1.
APPLY LASTKEY TO fill-in.
APPLY "U1" TO menu-item.
APply "CLOSE" TO window.

/* statements/apply.txt: APPLY statement with widget expressions */
APPLY "CHOOSE" TO Customer.Name.
APPLY SELECT TO hButton.
APPLY "CHOOSE" TO CURRENT-WINDOW.

/* statements/apply.txt: APPLY statement with keycode and frame widget-phrase */
APPLY 13 TO browse-1.
APPLY "CHOOSE" TO order-but IN FRAME x.

/* statements/apply.txt: APPLY statement with negative keycode and implicit target */
APPLY -2.
APPLY "ERROR" TO THIS-PROCEDURE.

/* statements/apply.txt: APPLY statement to named BROWSE widget */
APPLY "VALUE-CHANGED" TO BROWSE b1.

/* statements/assign.txt: ASSIGN basic */
ASSIGN a = 1.
ASSIGN x = "hello".
ASSIGN flag = TRUE.

/* statements/assign.txt: ASSIGN multiple pairs */
ASSIGN
  a = 1
  b = "x"
  c = TRUE
  d = 3.14.

/* statements/assign.txt: ASSIGN with WHEN AVAILABLE clause */
ASSIGN
  a = 1
  b = "x" WHEN AVAILABLE Customer
  c = Customer.Name WHEN AVAILABLE Customer.

/* statements/assign.txt: ASSIGN record/input */
ASSIGN Customer EXCEPT Name NO-ERROR.
ASSIGN INPUT FRAME frm Cust.Name = "x" WHEN TRUE NO-ERROR.

/* statements/assign.txt: ASSIGN with NO-ERROR */
ASSIGN amount = DECIMAL(par_amount) NO-ERROR.
ASSIGN a = 1 b = 2 NO-ERROR.

/* statements/assign.txt: ASSIGN with comment */
ASSIGN // note
  a = 1
  b = "x".

/* statements/assign.txt: ASSIGN with dataset reference */
ASSIGN c = dataset BDebtorShipTo:handle.

/* statements/assign.txt: ASSIGN with conditional expression */
ASSIGN status = IF ok THEN "Y" ELSE "N".

/* statements/assign.txt: ASSIGN with qualified names */
ASSIGN Customer.Name = "John"
       Customer.Balance = 100.00.

/* statements/assign.txt: Simple assignment statement */
x = 1.
Customer.Name = "test".
a = b + c.

/* statements/assign.txt: Assignment with NO-ERROR */
x = 1 NO-ERROR.

/* statements/assign.txt: Assignment to function result */
PUT-STRING(workBuf, 1) = cmdValue.

/* statements/assign.txt: Expression statement with NO-ERROR */
doWork() NO-ERROR.

/* statements/assign.txt: Assignment with INPUT, IN FRAME, and string options */
baz = INPUT FRAME y bar.
quux = INPUT qux.
x = qbf-s:SCREEN-VALUE IN FRAME qbf-area.
x = NOT x IN FRAME qbf-test.
a = "A":U.
b = "Hello":R10.
c = "Trim":T.

/* statements/assign.txt: Assignment with array initializers */
x = [1, ?, 3].
y = ["hello", ?, "world"].
z = [true, ?, false].
mixed = [1, "test", ?, true].

/* statements/assign.txt: ASSIGN with qualified WHEN AVAILABLE and NO-ERROR */
ASSIGN
  a = 1
  Customer.Name = "John" WHEN AVAILABLE sports.Customer
  b = 2
NO-ERROR.

/* statements/assign.txt: ASSIGN without expressions and keyword targets */
ASSIGN Customer.Name Customer.Balance.
ASSIGN CURRENT-WINDOW = hWin NO-ERROR.

/* statements/assign.txt: ASSIGN with include expression value */
ASSIGN a = {us/t0/t001.i}.

/* statements/assign.txt: ASSIGN with preprocessor names */
ASSIGN
  {&Bufor}.status = {&Status}
  a{&one}.field = 1
  a{&one}b.field = 2
  a{&one}{&two}.field = 3
  a{&one}{&two}b{&three}.value = 1
  value = {&Proces}
  &IF DEFINED (Flag) NE 0 &THEN
    {&Bufor}.flag = {&Flag}
  &ENDIF
  .

/* statements/assign.txt: ASSIGN - BROWSE attribute LHS */
ASSIGN BROWSE b1:CURRENT-ROW = 1.

/* statements/bell.txt: BELL statement */
BELL.

/* statements/bell.txt: BELL - reference snippet */
DEFINE VARIABLE outfile AS CHARACTER NO-UNDO FORMAT "x(8)" LABEL "Output file name".

getfile:
DO ON ERROR UNDO, RETRY:
  SET outfile WITH SIDE-LABELS.
  IF SEARCH(outfile) = outfile THEN DO:
    MESSAGE "A file named" outfile "already exists in your directory".
    MESSAGE "Please use another name".
    BELL.
    UNDO getfile, RETRY getfile.
  END.
END.

OUTPUT TO VALUE(outfile).

FOR EACH Customer NO-LOCK:
DISPLAY Customer.Name Customer.CreditLimit.
END.

/* statements/browse.txt: Define Browse Basic */
DEFINE BROWSE b1 QUERY q1 DISPLAY CustNum Name.

/* statements/browse.txt: Define Browse with Options */
DEFINE BROWSE b1 QUERY q1 DISPLAY CustNum Name
WITH TITLE "Customer Browse" DOWN 10.

/* statements/browse.txt: Define Browse with NO-ASSIGN and NO-BOX */
DEFINE BROWSE bNoAssign QUERY qNoAssign
  DISPLAY ttOrder.OrderNum
  WITH SIZE 77 BY 10 NO-ASSIGN NO-ROW-MARKERS NO-BOX SEPARATORS.

/* statements/browse.txt: Define Browse with WITH and Options */
DEFINE BROWSE b1 QUERY q1 DISPLAY CustNum Name
WITH DOWN 10 TITLE "Customer Browse".

/* statements/browse.txt: Define Browse with Column Options */
DEFINE BROWSE b1 QUERY q1
DISPLAY CustNum FORMAT ">>>>9" Name LABEL "Customer Name"
WITH DOWN 10.

/* statements/browse.txt: Define Browse Shared */
DEFINE NEW SHARED BROWSE b1 QUERY q1 DISPLAY CustNum Name.

/* statements/browse.txt: Define Browse Private */
DEFINE PRIVATE BROWSE b1 QUERY q1 DISPLAY CustNum Name.

/* statements/browse.txt: Define Browse with EXCEPT */
DEFINE BROWSE b1 QUERY q1 DISPLAY Customer EXCEPT Comments.

/* statements/browse.txt: Define Browse with Locks and Column Options */
DEFINE BROWSE b2 QUERY q2 NO-LOCK NO-WAIT
DISPLAY CustNum FORMAT ">>>>9" LABEL "ID" NO-LABELS
       Name COLUMN-LABEL "Full Name" COLUMN-BGCOLOR 4 LABEL-FGCOLOR 5
       HELP "Help" VALIDATE (CustNum > 0, "Bad")
       AUTO-RETURN DISABLE-AUTO-ZAP MOVEABLE RESIZABLE
ENABLE ALL WITH SIZE 80 BY 10 SCROLLBAR-VERTICAL SEPARATORS NO-ROW-MARKERS.

/* statements/browse.txt: BROWSE - widget-level NO-LABELS, NO-VALIDATE, OVERLAY */
DEF BROWSE b1 QUERY q1 DISPLAY c1
WITH SIZE 70 BY 18 NO-LABELS SEPARATORS NO-VALIDATE OVERLAY.

/* statements/browse.txt: Define Browse with Widget Options */
DEF PRIVATE BROWSE b3 QUERY q3 DISPLAY field1 field2
WITH DOWN 5 TITLE "Browse Title" BGCOLOR 7 DCOLOR 3 FGCOLOR 9 PFCOLOR 6 FONT 2
CONTEXT-HELP-ID 42 DROP-TARGET TOOLTIP "Browse tip" ROW 3 COLUMN 5.

/* statements/browse.txt: BROWSE - Computed Column Expression */
DEFINE BROWSE bExpr QUERY qExpr
  DISPLAY -1 * ttr_hist.tr_qty_loc LABEL "Ilosc".

/* statements/browse.txt: BROWSE - SHARE-LOCK */
DEFINE BROWSE bShare QUERY qShare SHARE-LOCK DISPLAY CustNum Name.

/* statements/browse.txt: BROWSE - EXCLUSIVE-LOCK */
DEFINE BROWSE bExclusive QUERY qExclusive EXCLUSIVE-LOCK DISPLAY CustNum Name.

/* statements/browse.txt: BROWSE - NO-LOCK with NO-WAIT */
DEFINE BROWSE bNoWait QUERY qNoWait NO-LOCK NO-WAIT
  DISPLAY CustNum Name
  WITH SIZE 50 BY 10.

/* statements/browse.txt: BROWSE - ENABLE phrase with specific fields */
DEFINE BROWSE bEnable QUERY qEnable DISPLAY CustNum Name
  ENABLE CustNum
  WITH SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - LABEL-FONT option */
DEFINE BROWSE bLabFont QUERY qQ DISPLAY
  CustNum LABEL-FONT 3
  Name LABEL-FONT 5
  WITH SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - COLUMN-DCOLOR option */
DEFINE BROWSE bColDcolor QUERY qQ DISPLAY
  CustNum COLUMN-DCOLOR 5
  Name COLUMN-DCOLOR 10
  WITH SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - LABEL-DCOLOR option */
DEFINE BROWSE bLabDcolor QUERY qQ DISPLAY
  CustNum LABEL-DCOLOR 7
  Name LABEL-DCOLOR 15
  WITH SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - COLUMN-PFCOLOR option */
DEFINE BROWSE bColPfcolor QUERY qQ DISPLAY
  CustNum COLUMN-PFCOLOR 3
  Name COLUMN-PFCOLOR 6
  WITH SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - LABEL-PFCOLOR option */
DEFINE BROWSE bLabPfcolor QUERY qQ DISPLAY
  CustNum LABEL-PFCOLOR 2
  Name LABEL-PFCOLOR 8
  WITH SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - LABEL-BGCOLOR option */
DEFINE BROWSE bLabBgcolor QUERY qQ DISPLAY
  CustNum LABEL-BGCOLOR 3
  Name LABEL-BGCOLOR 5
  WITH SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - SIZE-CHARS option */
DEFINE BROWSE bSizeChars QUERY qQ DISPLAY CustNum Name
  WITH SIZE-CHARS 40 BY 20.

/* statements/browse.txt: BROWSE - SIZE-PIXELS option */
DEFINE BROWSE bSizePixels QUERY qQ DISPLAY CustNum Name
  WITH SIZE-PIXELS 400 BY 200.

/* statements/browse.txt: BROWSE - SCROLLBAR-HORIZONTAL option */
DEFINE BROWSE bScrollH QUERY qQ DISPLAY CustNum Name
  WITH SCROLLBAR-HORIZONTAL SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - NO-EMPTY-SPACE option */
DEFINE BROWSE bNoEmpty QUERY qQ DISPLAY CustNum Name
  WITH NO-EMPTY-SPACE SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - FIT-LAST-COLUMN option */
DEFINE BROWSE bFitLast QUERY qQ DISPLAY CustNum Name
  WITH FIT-LAST-COLUMN SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - MULTIPLE option */
DEFINE BROWSE bMultiple QUERY qQ DISPLAY CustNum Name
  WITH MULTIPLE SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - NO-COLUMN-SCROLLING option */
DEFINE BROWSE bNoColScroll QUERY qQ DISPLAY CustNum Name
  WITH NO-COLUMN-SCROLLING SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - MAX-DATA-GUESS option */
DEFINE BROWSE bMaxData QUERY qQ DISPLAY CustNum Name
  WITH MAX-DATA-GUESS 10 SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - Multiple EXCEPT fields */
DEFINE BROWSE bMultiExc QUERY qQ DISPLAY Customer EXCEPT Comments1 Comments2 Status Flag.

/* statements/browse.txt: BROWSE - WIDTH option on column */
DEFINE BROWSE bWidth QUERY qQ DISPLAY
  CustNum WIDTH 10
  Name WIDTH 30
  WITH SIZE 60 BY 10.

/* statements/browse.txt: BROWSE - Minimal */
DEFINE BROWSE b QUERY q DISPLAY c.
DEF BROWSE browse QUERY q DISPLAY f1 f2.

/* statements/browse.txt: Define Browse with Qualified Columns and DOWN */
DEFINE BROWSE bPolicy QUERY qPolicy
    DISPLAY ttPolicy.tcPolName COLUMN-LABEL "Policy Name"
           ttPolicy.tcPolDesc COLUMN-LABEL "Policy Description"
    WITH 6 DOWN WIDTH 65 MULTIPLE.

/* statements/browse.txt: BROWSE - Additional column color/font options */
DEFINE BROWSE bColors QUERY qColors DISPLAY
  ttOrder.Amount COLUMN-FONT 4 COLUMN-FGCOLOR 12
  ttOrder.Status LABEL-FGCOLOR 6 LABEL-PFCOLOR 9
WITH DOWN 5.

/* statements/browse.txt: BROWSE - TITLE with color option and NO-UNDERLINE */
DEFINE BROWSE b1 QUERY q1 NO-LOCK DISPLAY x
WITH TITLE DCOLOR 5 'My Browse' NO-UNDERLINE NO-LABELS.

/* statements/browse.txt: Define Browse - multiple WITH phrases */
DEFINE BROWSE b1 QUERY q1 DISPLAY Name WITH TITLE "Customers" WITH DOWN 5.

/* statements/browse.txt: Define Browse - COL alias in WITH options */
DEFINE BROWSE b1 QUERY q1 DISPLAY Name WITH COL 20.

/* statements/buffer-compare.txt: BUFFER-COMPARE basic */
BUFFER-COMPARE bSrc TO bTgt.
BUFFER-COMPARE bSrc EXCEPT Field1 Field2 TO bTgt.
BUFFER-COMPARE bSrc USING Field1 Field2 TO bTgt.

/* statements/buffer-compare.txt: BUFFER-COMPARE with options */
BUFFER-COMPARE bSrc TO bTgt CASE-SENSITIVE.
BUFFER-COMPARE bSrc TO bTgt BINARY.
BUFFER-COMPARE bSrc TO bTgt SAVE lResult.
BUFFER-COMPARE bSrc TO bTgt SAVE RESULT IN cDiff.
BUFFER-COMPARE bSrc TO bTgt NO-LOBS.
BUFFER-COMPARE bSrc TO bTgt NO-ERROR.
BUFFER-COMPARE bSrc TO bTgt SAVE RESULT IN obj:prop NO-ERROR.

/* statements/buffer-compare.txt: BUFFER-COMPARE with COMPARES block */
BUFFER-COMPARE bSrc TO bTgt
  COMPARES:
    WHEN Field1 <> Field2 THEN MESSAGE "Mismatch".
  END.

/* statements/buffer-compare.txt: BUFFER-COMPARE with COMPARES and inner END COMPARES */
BUFFER-COMPARE bSrc TO bTgt
  COMPARES:
    WHEN Field1 = Field2 THEN APPLY "CHOOSE".
    WHEN Field3 BEGINS "A" THEN RUN DoWork.
  COMPARES END.

/* statements/buffer-compare.txt: BUFFER-COMPARE with EXPLICIT COMPARES and operators */
BUFFER-COMPARE bSrc TO bTgt
  EXPLICIT COMPARES:
    WHEN Field1 >= Field2 THEN ASSIGN flag = TRUE.
    WHEN Field3 < Field4 THEN MESSAGE "Less".
  END.

/* statements/buffer-copy.txt: BUFFER-COPY */
BUFFER-COPY bSrc TO bTgt.
BUFFER-COPY Customer TO ttCustomer.
BUFFER-COPY bSource EXCEPT Field1 Field2 TO bTarget.
BUFFER-COPY bSrc EXCEPT Field1, Field2, Field3 TO bTgt.
BUFFER-COPY tempDb.Customer TO tt.Customer.
BUFFER-COPY bSrc EXCEPT Customer.Name, Customer.Balance TO ttTarget.

/* statements/buffer-copy.txt: BUFFER-COPY with USING, ASSIGN, and options */
BUFFER-COPY bSrc USING Field1 Field2 TO bTgt.
BUFFER-COPY bSrc TO bTgt ASSIGN Field1 = 1 Field2 += 2.
BUFFER-COPY bSrc EXCEPT Field3 TO bTgt ASSIGN Field1 = 1 NO-LOBS NO-ERROR.
BUFFER-COPY bSrc TO bTgt ASSIGN Cust.Name = "X" Cust.Balance -= 10.

/* statements/buffer.txt: BUFFER DEFINITION - Basic Syntax */
DEFINE BUFFER bufCustomer FOR Customer.
DEF BUFFER bufOrder FOR Sales.Order.
DEFINE BUFFER bufTemp FOR TEMP-TABLE ttItems.

/* statements/buffer.txt: BUFFER DEFINITION - PRESELECT Option */
DEFINE BUFFER bufPre FOR Customer PRESELECT.
DEF BUFFER bufOrder FOR Sales.Order PRESELECT.
DEFINE BUFFER bufTemp FOR TEMP-TABLE ttData PRESELECT.

/* statements/buffer.txt: BUFFER DEFINITION - LABEL Option */
DEFINE BUFFER bufCust FOR Customer LABEL "Customer Buffer".
DEF BUFFER bufOrd FOR Sales.Order LABEL "Order".
DEFINE BUFFER bufTemp FOR TEMP-TABLE ttData LABEL ident.

/* statements/buffer.txt: BUFFER DEFINITION - NAMESPACE Options */
DEFINE BUFFER bufCust FOR Customer NAMESPACE-URI "http://example.com/ns" NAMESPACE-PREFIX "ex".
DEF BUFFER bufTemp FOR TEMP-TABLE ttData NAMESPACE-URI "urn:demo" NAMESPACE-PREFIX "d".
DEFINE BUFFER bufXml FOR ttTable NAMESPACE-URI "https://api.example.com/v1" NAMESPACE-PREFIX "api".

/* statements/buffer.txt: BUFFER DEFINITION - XML Options */
DEFINE BUFFER bufCust FOR Customer XML-NODE-NAME "customer".
DEF BUFFER bufOrder FOR Sales.Order XML-NODE-NAME "order" SERIALIZE-NAME "order-ser".
DEFINE BUFFER bufTemp FOR TEMP-TABLE ttData XML-NODE-NAME "item" SERIALIZE-NAME "ItemNode".

/* statements/buffer.txt: BUFFER DEFINITION - Complete XML Configuration */
DEFINE BUFFER bufFull FOR Customer
  LABEL "Customer"
  NAMESPACE-URI "http://example.com"
  NAMESPACE-PREFIX "cust"
  XML-NODE-NAME "Customer"
  SERIALIZE-NAME "cust:Cust".

/* statements/buffer.txt: BUFFER DEFINITION - Shared Scopes */
DEFINE NEW SHARED BUFFER bufShared FOR Customer.
DEFINE SHARED BUFFER bufUse FOR Sales.Order.
DEF NEW SHARED BUFFER bufTemp FOR TEMP-TABLE ttData.
DEF SHARED BUFFER bufCust FOR Customer.

/* statements/buffer.txt: BUFFER DEFINITION - Access Modifiers */
DEFINE PRIVATE BUFFER bufPriv FOR Customer.
DEFINE PROTECTED BUFFER bufProt FOR Sales.Order.
DEF PRIVATE BUFFER bufTemp FOR TEMP-TABLE ttData.

/* statements/buffer.txt: BUFFER DEFINITION - STATIC Modifier */
DEFINE STATIC BUFFER bufStatic FOR Customer.
DEFINE PROTECTED STATIC BUFFER bufPS FOR Sales.Order.
DEF PRIVATE STATIC BUFFER bufPTS FOR TEMP-TABLE ttData.

/* statements/buffer.txt: BUFFER DEFINITION - Shared with PRESELECT */
DEFINE NEW SHARED BUFFER bufPre FOR Customer PRESELECT.
DEF SHARED BUFFER bufOrder FOR Sales.Order PRESELECT.
DEFINE NEW SHARED BUFFER bufTemp FOR TEMP-TABLE ttData PRESELECT.

/* statements/buffer.txt: BUFFER DEFINITION - Private/Protected with Options */
DEFINE PRIVATE BUFFER bufPriv FOR Customer LABEL "Private" PRESELECT.
DEFINE PROTECTED BUFFER bufProt FOR Sales.Order NAMESPACE-URI "http://ex" NAMESPACE-PREFIX "p".
DEF PROTECTED STATIC BUFFER bufStatic FOR TEMP-TABLE ttData XML-NODE-NAME "node" SERIALIZE-NAME "ser".

/* statements/buffer.txt: BUFFER DEFINITION - Qualified Table Names */
DEFINE BUFFER bufQual FOR Sales.Customer.
DEFINE BUFFER bufDb FOR Database.Schema.Table.
DEF BUFFER bufQ2 FOR MyProc.TempTable.

/* statements/buffer.txt: BUFFER DEFINITION - TEMP-TABLE with All Options */
DEFINE BUFFER bufTemp FOR TEMP-TABLE ttOrder
  PRESELECT
  LABEL "Temp Orders"
  NAMESPACE-URI "http://temp"
  NAMESPACE-PREFIX "t"
  XML-NODE-NAME "Order"
  SERIALIZE-NAME "order-ser".

/* statements/buffer.txt: BUFFER DEFINITION - Minimal Options */
DEFINE BUFFER b FOR Customer.
DEF BUFFER b1 FOR ttData.
DEF NEW SHARED BUFFER b2 FOR Customer PRESELECT.

/* statements/buffer.txt: BUFFER DEFINITION - Reference snippets and ordering */
DEFINE BUFFER other-cust FOR Customer.
DEFINE NEW SHARED BUFFER rec FOR Customer PRESELECT.
DEFINE SHARED BUFFER rec FOR Customer PRESELECT.
DEFINE PRIVATE STATIC BUFFER bufStaticPriv FOR Customer.
DEFINE BUFFER procBuf FOR proc-text-buffer.

/* statements/button.txt: BUTTON DEFINITION */
DEFINE BUTTON btnTestButton LABEL "Click Me".
DEF BUTTON btnLike LIKE btnTestButton.
DEFINE BUTTON btnOptions AUTO-GO DEFAULT BGCOLOR 1 FGCOLOR 2 DCOLOR 3 PFCOLOR 4 FONT 5 CONTEXT-HELP-ID 77 MOUSE-POINTER "arrow" LABEL "Go".
DEFINE PRIVATE BUTTON btnImages IMAGE FILE "ok.png" IMAGE-SIZE 10 BY 5 FROM ROW 2 COLUMN 3 IMAGE-DOWN FILE "ok-down.png" IMAGE-SIZE-PIXELS 8 BY 6 FROM X 1 Y 2 IMAGE-INSENSITIVE FILE "ok-off.png" SIZE-PIXELS 20 BY 6 NO-FOCUS FLAT-BUTTON NO-CONVERT-3D-COLORS TOOLTIP "OK" DROP-TARGET.
DEF BUTTON btnEnd AUTO-ENDKEY LIKE btnTestButton.

/* statements/button.txt: BUTTON - AUTO-GO Only */
DEFINE BUTTON btnAuto AUTO-GO.
DEF BUTTON btnAuto2 AUTO-GO.

/* statements/button.txt: BUTTON - AUTO-ENDKEY Only */
DEFINE BUTTON btnEndKey AUTO-ENDKEY.
DEF BUTTON btnEK AUTO-ENDKEY.

/* statements/button.txt: BUTTON - DEFAULT Only */
DEFINE BUTTON btnDefault DEFAULT.
DEF BUTTON btnDef DEFAULT.

/* statements/button.txt: BUTTON - LABEL Only */
DEFINE BUTTON btnLabel LABEL "Submit".
DEF BUTTON btnLbl LABEL btnLbl.

/* statements/button.txt: BUTTON - SIZE Only */
DEFINE BUTTON btnSize SIZE 10 BY 20.
DEF BUTTON btnSz SIZE-CHARS 15 BY 25.

/* statements/button.txt: BUTTON - IMAGE Only */
DEFINE BUTTON btnImg IMAGE FILE "up.png".
DEF BUTTON btnImg2 IMAGE-UP FILE "up.png".

/* statements/button.txt: BUTTON - IMAGE-DOWN Only */
DEFINE BUTTON btnDown IMAGE-DOWN FILE "down.png".

/* statements/button.txt: BUTTON - IMAGE-INSENSITIVE Only */
DEFINE BUTTON btnIns IMAGE-INSENSITIVE FILE "ins.png".

/* statements/button.txt: BUTTON - NO-FOCUS Only */
DEFINE BUTTON btnNoFocus NO-FOCUS.
DEF BUTTON btnNF NO-FOCUS FLAT-BUTTON.

/* statements/button.txt: BUTTON - DROP-TARGET Only */
DEFINE BUTTON btnDrop DROP-TARGET.
DEF BUTTON btnDT DROP-TARGET.

/* statements/button.txt: BUTTON - NO-CONVERT-3D-COLORS Only */
DEFINE BUTTON btnNoConvert NO-CONVERT-3D-COLORS.

/* statements/button.txt: BUTTON - TOOLTIP Only */
DEFINE BUTTON btnTool TOOLTIP "Button tooltip".
DEF BUTTON btnTT TOOLTIP text.

/* statements/button.txt: BUTTON - PRIVATE Modifier */
DEFINE PRIVATE BUTTON btnPriv LABEL "Private".

/* statements/button.txt: BUTTON - All Color Options */
DEFINE BUTTON btnColors BGCOLOR 1 FGCOLOR 2 DCOLOR 3 PFCOLOR 4.

/* statements/button.txt: BUTTON - FONT Only */
DEFINE BUTTON btnFont FONT 2.

/* statements/button.txt: BUTTON - CONTEXT-HELP-ID Only */
DEFINE BUTTON btnContext CONTEXT-HELP-ID 100.

/* statements/button.txt: BUTTON - MOUSE-POINTER Only */
DEFINE BUTTON btnPointer MOUSE-POINTER "hand".
DEF BUTTON btnMP MOUSE-POINTER "default".

/* statements/button.txt: BUTTON - LIKE Only */
DEFINE BUTTON btnLike2 LIKE otherBtn.

/* statements/button.txt: BUTTON - IMAGE with FROM X Y */
DEFINE BUTTON btnImgXY IMAGE FILE "img.png" IMAGE-SIZE 50 BY 50 FROM X 10 Y 20.

/* statements/button.txt: BUTTON - IMAGE with FROM ROW COLUMN */
DEFINE BUTTON btnImgRC IMAGE FILE "img.png" FROM ROW 5 COLUMN 10.

/* statements/button.txt: BUTTON - Minimal */
DEFINE BUTTON b.
def button btn.

/* statements/button.txt: BUTTON - Complete Combination */
DEFINE BUTTON btnFull
  AUTO-GO
  DEFAULT
  BGCOLOR 5
  FGCOLOR 10
  DCOLOR 15
  PFCOLOR 20
  FONT 3
  CONTEXT-HELP-ID 100
  MOUSE-POINTER "hand"
  LABEL "Complete"
  IMAGE FILE "up.png" IMAGE-SIZE 30 BY 30
  IMAGE-DOWN FILE "down.png" IMAGE-SIZE 30 BY 30
  SIZE-PIXELS 40 BY 40
  NO-FOCUS
  NO-CONVERT-3D-COLORS
  TOOLTIP "Complete button"
  DROP-TARGET.

/* statements/button.txt: BUTTON - Reference snippets */
DEFINE BUTTON more-button LABEL "More".
DEFINE BUTTON next-button LABEL "Next".
DEFINE BUTTON button-1 LABEL "Drop Here" DROP-TARGET.

/* statements/button.txt: DEFINE BUTTON - BUTTONS keyword alias */
DEFINE BUTTONS btn1.

/* statements/call.txt: CALL */
CALL myRoutine.
CALL processData "input.dat".
CALL updateRecord iId cName dDate.

/* statements/call.txt: CALL - argument expressions */
CALL myRoutine 1 "arg" TODAY.
CALL runCalc (a + b) func(arg1, arg2).
CALL doWork ? TODAY.

/* statements/case.txt: CASE */
CASE status:
  WHEN "A" THEN DO:
    PUT UNFORMATTED "A" SKIP.
  END.
  WHEN "B" THEN PUT UNFORMATTED "B" SKIP.
  OTHERWISE PUT UNFORMATTED "Z" SKIP.
END CASE.

/* statements/case.txt: CASE END */
CASE user_role:
  WHEN "ADMIN" THEN access_level = 3.
  OTHERWISE access_level = 0.
END.

/* statements/case.txt: CASE - Reference snippet and OR WHEN */
DEFINE VARIABLE pay-stat AS INTEGER NO-UNDO INITIAL 1.
CASE pay-stat:
  WHEN 1 THEN MESSAGE "This account is unpaid.".
  WHEN 2 OR WHEN 3 THEN DO:
    MESSAGE "Paid.".
  END.
END CASE.

/* statements/case.txt: CASE with expression and no OTHERWISE */
CASE Order.Status:
  WHEN "OPEN" THEN RUN OpenOrder.
  WHEN "HOLD" THEN RUN HoldOrder.
END.

/* statements/catch.txt: CATCH */
CATCH err AS Progress.Lang.Error:
  PUT UNFORMATTED "boom" SKIP.
END.

/* statements/catch.txt: CATCH - Reference snippets and CLASS */
DO ON ERROR UNDO, LEAVE:
  FIND Customer WHERE CustNum = 5000.
  CATCH eSysError AS Progress.Lang.SysError:
    MESSAGE eSysError:GetMessage(1) VIEW-AS ALERT-BOX.
  END CATCH.
END.

DO ON ERROR UNDO, LEAVE:
  FIND FIRST Customer WHERE CustNum = 6000.
  CATCH eError AS CLASS Progress.Lang.Error:
    MESSAGE eError:GetMessage(1).
  END CATCH.
END.

DO TRANSACTION ON ERROR UNDO, THROW:
  RUN DoWork.
  CATCH err AS Progress.Lang.SysError:
    UNDO, THROW.
  END.
END.

/* statements/choose.txt: CHOOSE - ROW basic */
CHOOSE ROW field1.

/* statements/choose.txt: CHOOSE - ROW with HELP */
CHOOSE ROW fieldName HELP "Help text for this field".

/* statements/choose.txt: CHOOSE - FIELD single */
CHOOSE FIELD field1.

/* statements/choose.txt: CHOOSE - FIELD with multiple options */
CHOOSE FIELD field1 field2 field3.

/* statements/choose.txt: CHOOSE - FIELD single with HELP */
CHOOSE FIELD fieldName HELP "Help for this field".

/* statements/choose.txt: CHOOSE - FIELD multiple with Help */
CHOOSE FIELD field1 HELP "First field help" field2 HELP "Second field help" field3 HELP "Third field help".

/* statements/choose.txt: CHOOSE - AUTO-RETURN */
CHOOSE ROW field1 AUTO-RETURN.
CHOOSE FIELD field1 field2 AUTO-RETURN.

/* statements/choose.txt: CHOOSE - COLOR */
CHOOSE ROW field1 COLOR NORMAL.
CHOOSE FIELD field1 COLOR INPUT.

/* statements/choose.txt: CHOOSE - COLOR VALUE expression */
CHOOSE ROW field1 COLOR VALUE(myColor).

/* statements/choose.txt: CHOOSE - GO-ON */
CHOOSE ROW field1 GO-ON (KEY1 KEY2 KEY3).
CHOOSE FIELD field1 GO-ON(F1 F2 F3 RETURN).

/* statements/choose.txt: CHOOSE - KEYS */
CHOOSE ROW field1 KEYS keyVar.
CHOOSE FIELD field1 KEYS keystrokes.

/* statements/choose.txt: CHOOSE - NO-ERROR */
CHOOSE ROW field1 NO-ERROR.
CHOOSE FIELD field1 NO-ERROR.

/* statements/choose.txt: CHOOSE - PAUSE */
CHOOSE ROW field1 PAUSE 5.
CHOOSE FIELD field1 PAUSE 10.

/* statements/choose.txt: CHOOSE - WITH FRAME */
CHOOSE ROW field1 WITH FRAME frameName.
CHOOSE FIELD field1 WITH FRAME myFrame.

/* statements/choose.txt: CHOOSE - ROW combined options */
CHOOSE ROW fieldName HELP "Help text" AUTO-RETURN COLOR NORMAL KEYS keyVar NO-ERROR.

/* statements/choose.txt: CHOOSE - FIELD combined options */
CHOOSE FIELD field1 field2 HELP "Multiple field help" AUTO-RETURN COLOR NORMAL.

/* statements/choose.txt: CHOOSE - with GO-ON and KEYS */
CHOOSE ROW field1 GO-ON (KEY1 KEY2) KEYS keyVar PAUSE 30.

/* statements/choose.txt: CHOOSE - complete combination */
CHOOSE ROW fieldName HELP "Help for field" AUTO-RETURN COLOR NORMAL GO-ON (F1 F2) KEYS keyVar NO-ERROR PAUSE 15 WITH FRAME mainFrame.

/* statements/choose.txt: CHOOSE - minimal */
CHOOSE ROW f.
CHOOSE FIELD f1 f2 f3.

/* statements/choose.txt: CHOOSE - COLOR MESSAGES */
CHOOSE ROW field1 COLOR MESSAGES.

/* statements/choose.txt: CHOOSE - many fields with HELP */
CHOOSE FIELD f1 HELP "First" f2 HELP "Second" f3 HELP "Third" f4 HELP "Fourth" f5 HELP "Fifth".

/* statements/choose.txt: CHOOSE - FIELD with all HELP */
CHOOSE FIELD opt1 HELP "Option 1" opt2 HELP "Option 2" opt3 HELP "Option 3" opt4 HELP "Option 4" opt5 HELP "Option 5".

/* statements/choose.txt: CHOOSE - FIELD with mixed HELP and no HELP */
CHOOSE FIELD fieldWithHelp HELP "Has help" fieldNoHelp fieldMoreHelp HELP "Also has help".

/* statements/choose.txt: CHOOSE - GO-ON single key */
CHOOSE ROW field1 GO-ON (F1).

/* statements/choose.txt: CHOOSE - KEYS with short variable */
CHOOSE ROW field1 KEYS k.

/* statements/choose.txt: CHOOSE - PAUSE with variable */
CHOOSE ROW field1 PAUSE timeout.

/* statements/choose.txt: CHOOSE - COLOR with variable */
CHOOSE ROW field1 COLOR colorVar.

/* statements/choose.txt: CHOOSE - all options without HELP/GO-ON */
CHOOSE ROW field1 AUTO-RETURN COLOR NORMAL KEYS k NO-ERROR PAUSE 10 WITH FRAME f1.

/* statements/choose.txt: CHOOSE - FIELD without options */
CHOOSE FIELD opt1 opt2 opt3 opt4.

/* statements/choose.txt: CHOOSE - GO-ON with multiple keys */
CHOOSE ROW field1 GO-ON (KEYCODE RETURN END-ERROR).

/* statements/choose.txt: CHOOSE - HELP with longer text */
CHOOSE ROW field1 HELP "This is a longer help text description for the field that explains what the user should do when they select this option from the menu".

/* statements/choose.txt: CHOOSE - comprehensive test */
CHOOSE FIELD option1 HELP "First option" option2 HELP "Second option" option3 HELP "Third" AUTO-RETURN COLOR NORMAL GO-ON (F1 F2 F3 RETURN) KEYS menuKeys NO-ERROR PAUSE 30 WITH FRAME mainMenuFrame.

/* statements/choose.txt: CHOOSE - Reference snippet */
CHOOSE FIELD menu GO-ON (F5) AUTO-RETURN WITH FRAME f-menu.

/* statements/choose.txt: CHOOSE - GO-ON with quoted keys */
CHOOSE ROW field1 GO-ON ("F5" "CTRL-D").

/* statements/class.txt: CLASS */
CLASS FunkyWorld.Util.KittyLogHelper:
  VAR PRIVATE INT64 MAX_RECORDS = 5.
  VAR PROTECTED INT64 DEFAULT_SIZE = 20.
  VAR PUBLIC CHAR SomeName.

  @Setup.
  METHOD PUBLIC VOID setup():
    oObject = NEW Object().
  END METHOD.

  DEFINE PUBLIC PROPERTY m_Total AS INTEGER NO-UNDO
    GET.
    SET.

  DEFINE PUBLIC PROPERTY Totals AS INTEGER NO-UNDO
    GET:
      RETURN m_Total.
    END GET.
    SET (newValue AS INTEGER):
      m_Total = newValue.
    END SET.

  DEFINE PRIVATE PROPERTY MY_NUMBER AS CHAR NO-UNDO INIT "9999"
    GET.
    SET.

  METHOD PUBLIC VOID csvFileToTempTable(
      INPUT pcFilePath AS CHAR,
      OUTPUT TABLE-HANDLE phOutputTable):
    RETURN.
  END METHOD.
END CLASS.

CLASS DecoratedMotorcycle:
  CONSTRUCTOR PUBLIC DecoratedMotorcycle():
    MESSAGE "moto".
  END METHOD.
  DESTRUCTOR PUBLIC DecoratedMotorcycle():
    MESSAGE "bye".
  END DESTRUCTOR.
END CLASS.

INTERFACE Common.Message.IMessage:
  METHOD PUBLIC IMessage SetLanguage (INPUT poLanguage AS Language).
END INTERFACE.

CLASS Testings:
  CONSTRUCTOR PUBLIC Testings(databasename AS CHAR):
    MESSAGE "create " + databasename.
  END CONSTRUCTOR.

  METHOD PUBLIC VOID stuff(  ).
    MESSAGE "hi".
  END METHOD.
END CLASS.

CLASS Base:
  METHOD PUBLIC VOID work():
    RETURN.
  END METHOD.
END CLASS.

CLASS Derived INHERITS Base:
  METHOD PUBLIC OVERRIDE VOID work():
    RETURN.
  END METHOD.
END CLASS.

CLASS TableMethodOpts:
  METHOD PUBLIC VOID useTable(
      OUTPUT TABLE FOR tt APPEND BIND BY-VALUE BY-REFERENCE):
    RETURN.
  END METHOD.
END CLASS.

CLASS BufferMethodOpts:
  METHOD PUBLIC CHARACTER useBuffer(BUFFER pBuf FOR myTable):
    RETURN "".
  END METHOD.
END CLASS.

CLASS DatasetHandleMethod:
  METHOD PUBLIC VOID useDs(INPUT-OUTPUT DATASET-HANDLE hDs):
    RETURN.
  END METHOD.
END CLASS.

/* statements/class.txt: CLASS - Events and Widget Definitions */
CLASS UiWidgets:
  DEFINE PRIVATE BROWSE bCust QUERY qCust
    DISPLAY Customer.CustNum Customer.Name.
  DEFINE PRIVATE FRAME frCust Customer.CustNum Customer.Name.
  DEFINE MENU mnuMain MENUBAR
    MENU-ITEM miFile LABEL "File"
    MENU-ITEM miExit LABEL "Exit".
  DEFINE SUB-MENU smFile
    MENU-ITEM miOpen LABEL "Open".
  DEFINE RECTANGLE rectBorder SIZE 80 BY 10.
  DEFINE PUBLIC EVENT DataChanged SIGNATURE VOID (INPUT id AS INTEGER).
END CLASS.

/* statements/class.txt: CLASS - Options and ABSTRACT method */
ABSTRACT SERIALIZABLE CLASS MyPkg.Tools.AbstractThing
  INHERITS BaseThing
  IMPLEMENTS IFoo, IBar
  USE-WIDGET-POOL:
  METHOD PUBLIC ABSTRACT VOID DoIt().
END CLASS.

/* statements/class.txt: THIS-OBJECT method call and chained access */
CLASS Foo:
  METHOD PUBLIC VOID DoIt():
    THIS-OBJECT:DoSomething(BUFFER pBuf, BUFFER pOther).
    THIS-OBJECT:getInner():DoSomething(BUFFER pBuf).
  END METHOD.
END CLASS.

/* statements/clear.txt: CLEAR statement */
CLEAR.
CLEAR FRAME ex.
CLEAR FRAME ex NO-PAUSE.
CLEAR ALL.
CLEAR FRAME myframe ALL NO-PAUSE.

/* statements/clear.txt: CLEAR - Reference snippet */
CLEAR FRAME ex NO-PAUSE.

/* statements/close-query.txt: CLOSE QUERY statement */
CLOSE QUERY qCustomer.
CLOSE QUERY my-query.

/* statements/close-query.txt: CLOSE QUERY - Reference snippet */
CLOSE QUERY q-cust.

/* statements/close-stored-procedure.txt: CLOSE STORED-PROCEDURE */
CLOSE STORED-PROCEDURE hProc.
CLOSE STORED-PROCEDURE hProc iStatus = PROC-STATUS.
CLOSE STORED-PROCEDURE hProc WHERE PROC-HANDLE = hHandle.
CLOSE STORED-PROCEDURE hProc iStatus = PROC-STATUS WHERE PROC-HANDLE = hHandle.

/* statements/close-stored-procedure.txt: CLOSE STORED-PROCEDURE - Reference snippet */
CLOSE STORED-PROC p1 st = PROC-STATUS WHERE PROC-HANDLE = h.

/* statements/color.txt: COLOR */
COLOR DISPLAY 1 field1.
COLOR 7 field1 field2 field3.
COLOR DISPLAY NORMAL field1.
COLOR DISPLAY VALUE (myColor) field1.
COLOR DISPLAY "FF" field1.
COLOR DISPLAY BLINK-RED field1.
COLOR 7 PROMPT 3 field1.
COLOR 7 PROMPT 3 field1 WITH FRAME f1.

/* statements/color.txt: COLOR - Reference snippet and PROMPT form */
COLOR DISPLAY VALUE(hilite) Item.ItemNum Item.OnHand.
COLOR PROMPT INPUT field1 field2 WITH FRAME f1.

/* statements/compile.txt: COMPILE - OPTIONS-FILE and SAVE with logical */
COMPILE myproc.p OPTIONS-FILE "compile.opts" SAVE = TRUE INTO "r".

/* statements/compile.txt: COMPILE - LISTING with APPEND and PAGE options */
COMPILE myproc.p LISTING "out.lst" APPEND = TRUE.
COMPILE myproc.p LISTING "out.lst" PAGE-SIZE 80 PAGE-WIDTH 132.

/* statements/compile.txt: COMPILE - XREF and STRING-XREF with APPEND */
COMPILE myproc.p XREF "xref.txt" APPEND = FALSE STRING-XREF "sxref.txt" APPEND = TRUE.

/* statements/compile.txt: COMPILE - Reference snippets and additional options */
COMPILE ord-ent SAVE.
COMPILE r-incl.p SAVE LISTING r-incl.lis XREF r-incl.xrf DEBUG-LIST r-incl.dbg.
COMPILE VALUE("myproc.p") OPTIONS "require-full-names".
COMPILE myproc.p OPTIONS-FILE VALUE(optFile) SAVE INTO VALUE(outDir).
COMPILE myproc.p XCODE "key".
COMPILE myproc.p XREF-XML "xrefdir".
COMPILE myproc.p STREAM-IO.
COMPILE myproc.p LANGUAGES("en") TEXT-SEG-GROW 100.
COMPILE myproc.p PREPROCESS "pre.out".
COMPILE myproc.p V6FRAME USE-REVVIDEO.
COMPILE myproc.p V6FRAME USE-UNDERLINE.
COMPILE myproc.p MIN-SIZE DEFAULT-UNTRANSLATABLE NO-ERROR.

/* statements/connect.txt: CONNECT statement */
CONNECT mydb NO-ERROR.
CONNECT VALUE("-db mydb -H localhost").

/* statements/connect.txt: CONNECT with connection options */
CONNECT -db Sports2020 -H dbserver -S 1900 -U appuser -P secret NO-ERROR.
CONNECT -db Sports2020 -H dbserver.
CONNECT mydb1 -1 -db mydb2 -1 NO-ERROR.

/* statements/connect.txt: CONNECT - Reference snippets */
CONNECT mydb1 -1 -db mydb2 -1 NO-ERROR.
CONNECT VALUE("-db C:\\OpenEdge\\WRK\\db\\Sports2020 -H dbserver -S 1900") NO-ERROR.

/* statements/convert.txt: CONVERT */
CONVERT SOURCE CODEPAGE "1250" TARGET CODEPAGE "UTF-8".

/* statements/convert.txt: CONVERT - different literals */
CONVERT SOURCE CODEPAGE "ibm850" TARGET CODEPAGE "utf-8".

/* statements/copy-lob.txt: COPY-LOB */
COPY-LOB FROM FILE outPath TO targetPtr.
COPY-LOB FROM FILE inPath TO targetPtr CONVERT SOURCE CODEPAGE "1250" TARGET CODEPAGE "UTF-8".

/* statements/copy-lob.txt: COPY-LOB - Additional phrases */
COPY-LOB OBJECT srcLob TO OBJECT tgtLob NO-CONVERT.
COPY-LOB FROM FILE inPath STARTING AT 2 FOR 10 TO FILE outPath APPEND.
COPY-LOB FROM OBJECT srcLob TO OBJECT tgtLob OVERLAY AT 3 TRIM.
COPY-LOB FROM FILE inPath TO targetPtr NO-ERROR.

/* statements/create-socket.txt: CREATE SOCKET */
CREATE SOCKET sock.

/* statements/create-socket.txt: CREATE SERVER-SOCKET */
CREATE SERVER-SOCKET hSS NO-ERROR.

/* statements/create-socket.txt: CREATE SOCKET - NO-ERROR */
CREATE SOCKET sock NO-ERROR.

/* statements/create-temp-table.txt: CREATE TEMP-TABLE */
CREATE TEMP-TABLE ttHandle.
CREATE TEMP-TABLE ttHandle IN WIDGET-POOL pool1.

/* statements/create-widget.txt: CREATE WIDGET */
CREATE BUTTON hBtn IN WIDGET-POOL wp ASSIGN WIDTH = 10 HEIGHT = 2.
CREATE VALUE("MY-WIDGET") ASSIGN SENSITIVE = TRUE.
CREATE FRAME hFrame TRIGGERS:
  ON CHOOSE DO:
    MESSAGE "ok".
  END.
  ON ENTRY DO:
    MESSAGE "entry".
  END.
END TRIGGERS.

/* statements/create-widget.txt: CREATE WIDGET - window and dialog-box */
CREATE WINDOW hWin.
CREATE DIALOG-BOX hDlg IN WIDGET-POOL wp.

/* statements/create-widget.txt: CREATE WIDGET - browse */
CREATE BROWSE hBr IN WIDGET-POOL wp ASSIGN TITLE = "t".

/* statements/create.txt: CREATE basic */
CREATE Customer NO-ERROR.
CREATE Order.
CREATE tDebtorShipTo.
CREATE SERVER appSrv.

/* statements/create.txt: CREATE with preprocessor record */
CREATE {&Bufor}.

/* statements/create.txt: CREATE with qualified name */
CREATE Sports2000.Customer.
CREATE db.TableName.
CREATE {&Db}.Customer.
CREATE a{&one}b{&two}.Customer.

/* statements/create.txt: BUFFER-COPY basic */
BUFFER-COPY tApiBusinessRelation TO tBusinessRelation.
BUFFER-COPY srcBuf TO dstBuf.

/* statements/create.txt: BUFFER-COPY with EXCEPT */
BUFFER-COPY src_tbl EXCEPT fld1 fld2 TO dst_tbl.
BUFFER-COPY Customer EXCEPT CustNum CreatedDate TO ttCustomer.

/* statements/create.txt: CREATE in transaction */
DO TRANSACTION:
  CREATE Customer.
  ASSIGN Customer.Name = "Test".
END.

/* statements/create.txt: CREATE - Reference snippets and options */
CREATE Order.
CREATE OrderLine.
CREATE Customer FOR TENANT 0.
CREATE Customer USING ROWID(1) NO-ERROR.
CREATE Customer USING RECID(2).

/* statements/create.txt: CREATE - Handles and objects */
CREATE ALIAS myalias FOR DATABASE mydb NO-ERROR.
CREATE BUFFER hBuf FOR TABLE Customer BUFFER-NAME mybuf IN WIDGET-POOL wp.
CREATE BUFFER hBuf2 FOR TABLE Customer NO-ERROR.
CREATE CALL hCall IN WIDGET-POOL wp NO-ERROR.
CREATE CLIENT-PRINCIPAL hCP IN WIDGET-POOL wp.
CREATE QUERY hQ IN WIDGET-POOL wp.
CREATE DATASET hDS IN WIDGET-POOL wp.
CREATE DATA-SOURCE hDSrc IN WIDGET-POOL wp.
CREATE X-DOCUMENT hX IN WIDGET-POOL wp.
CREATE X-NODEREF hN IN WIDGET-POOL wp.
CREATE SOAP-HEADER hSH IN WIDGET-POOL wp.
CREATE SOAP-HEADER-ENTRYREF hSHE IN WIDGET-POOL wp.
CREATE SAX-READER hSR IN WIDGET-POOL wp NO-ERROR.
CREATE SAX-WRITER hSW IN WIDGET-POOL wp NO-ERROR.
CREATE SAX-ATTRIBUTES hSA IN WIDGET-POOL wp NO-ERROR.
CREATE WIDGET-POOL wp PERSISTENT NO-ERROR.
CREATE SERVER hSrv ASSIGN SERVER-CONNECTION-ID = 1.
CREATE DATABASE "newdb" FROM "olddb" NEW-INSTANCE REPLACE NO-ERROR.
CREATE "Excel.Application" hExcel CONNECT TO "file.xls" NO-ERROR.

/* statements/create.txt: CREATE BUFFER with string table target */
CREATE BUFFER hUS FOR TABLE "UserSession".

/* statements/data-source.txt: DATA-SOURCE DEFINITION - Basic Syntax */
DEFINE DATA-SOURCE dsCust FOR bCust.
DEF DATA-SOURCE dsOrder FOR bOrder.

/* statements/data-source.txt: DATA-SOURCE DEFINITION - QUERY Option */
DEFINE DATA-SOURCE dsCust QUERY qOrders FOR bCust.
DEF DATA-SOURCE dsOrder QUERY qMain FOR bOrder.

/* statements/data-source.txt: DATA-SOURCE DEFINITION - KEYS ROWID */
DEFINE DATA-SOURCE dsRowid FOR bCust KEYS (ROWID).
DEF DATA-SOURCE dsOrder2 FOR bOrder KEYS (ROWID).

/* statements/data-source.txt: DATA-SOURCE DEFINITION - KEYS with Fields */
DEFINE DATA-SOURCE dsField FOR bCust KEYS (CustNum).
DEF DATA-SOURCE dsFields FOR bOrder KEYS (OrderNum, CustNum, SalesRep).

/* statements/data-source.txt: DATA-SOURCE DEFINITION - Multiple Buffers */
DEFINE DATA-SOURCE dsMulti FOR bCust, bOrder.
DEF DATA-SOURCE dsBoth FOR bHeader, bLine.

/* statements/data-source.txt: DATA-SOURCE DEFINITION - Multiple Buffers with KEYS */
DEFINE DATA-SOURCE dsKeys FOR bCust KEYS (CustNum), bOrder KEYS (OrderNum, CustNum).
DEF DATA-SOURCE dsMulti2 FOR bHeader KEYS (ROWID), bLine KEYS (RowID).

/* statements/data-source.txt: DATA-SOURCE DEFINITION - QUERY with KEYS */
DEFINE DATA-SOURCE dsQk1 QUERY qMain FOR bCust KEYS (CustNum), bOrder KEYS (OrderNum).
DEF DATA-SOURCE dsQk2 QUERY qMulti FOR bHeader KEYS (ROWID), bLine KEYS (OrderNum).

/* statements/data-source.txt: DATA-SOURCE DEFINITION - QUERY Only */
DEFINE DATA-SOURCE dsQuery QUERY qOrders.
DEF DATA-SOURCE dsQuery2 QUERY qCustomers.

/* statements/data-source.txt: DATA-SOURCE DEFINITION - Three Buffers */
DEFINE DATA-SOURCE dsThree FOR bHeader, bDetail, bLine.

/* statements/data-source.txt: DATA-SOURCE DEFINITION - Access Modifiers */
CLASS x:
  DEFINE PRIVATE DATA-SOURCE dsPriv FOR bCust.
  DEFINE PROTECTED DATA-SOURCE dsProt FOR bOrder.
  DEF PRIVATE DATA-SOURCE dsQuery QUERY qMain.
END CLASS.

/* statements/data-source.txt: DATA-SOURCE DEFINITION - STATIC Modifier */
CLASS x:
  DEFINE STATIC DATA-SOURCE dsStatic FOR bCust.
  DEF PROTECTED STATIC DATA-SOURCE dsProtStatic FOR bOrder.
  DEFINE PRIVATE STATIC DATA-SOURCE dsPrivStatic QUERY qMain.
END.

/* statements/data-source.txt: DATA-SOURCE DEFINITION - Combinations */
DEFINE DATA-SOURCE dsFull QUERY qMulti
  FOR bCust KEYS (CustNum), bOrder KEYS (OrderNum, CustNum).

/* statements/data-source.txt: DATA-SOURCE DEFINITION - Minimal */
DEFINE DATA-SOURCE ds FOR b.
DEF DATA-SOURCE d FOR buf.

/* statements/data-source.txt: DATA-SOURCE DEFINITION - Reference snippet variations */
DEFINE DATA-SOURCE dsQueryOnly QUERY qMain.
DEFINE DATA-SOURCE dsKeyRowid FOR bCust KEYS (ROWID).

/* statements/dataset.txt: DATASET DEFINITION - Basic Syntax */
DEFINE DATASET dsCustomer FOR ttCustomer.
DEF DATASET dsOrder FOR ttHeader, ttLine.
DEFINE DATASET dsEmpty.

/* statements/dataset.txt: DATASET DEFINITION - Multiple Tables */
DEFINE DATASET dsMulti FOR ttCustomer, ttOrder, ttOrderLine.
DEF DATASET dsThree FOR ttHeader, ttDetail, ttTotals.

/* statements/dataset.txt: DATASET DEFINITION - Single Table */
DEFINE DATASET dsSingle FOR ttData.
DEF DATASET dsOne FOR ttTable.

/* statements/dataset.txt: DATASET DEFINITION - Four Tables */
DEFINE DATASET dsFull FOR ttHeader, ttDetail, ttTax, ttLine.

/* statements/dataset.txt: DATASET DEFINITION - No Tables */
DEFINE DATASET dsNoTables.

/* statements/dataset.txt: DATASET DEFINITION - Short Form */
DEF DATASET d FOR t.
DEF DATASET ds FOR tt.

/* statements/dataset.txt: DATASET DEFINITION - Reference options */
DEFINE NEW SHARED DATASET dsShared FOR ttCustomer.
DEFINE SHARED DATASET dsUse FOR ttCustomer.
DEFINE PRIVATE STATIC DATASET dsPrivStatic FOR ttCustomer.
DEFINE PROTECTED DATASET dsProt FOR ttCustomer.
DEFINE SERIALIZABLE DATASET dsSer FOR ttCustomer.
DEFINE NON-SERIALIZABLE DATASET dsNonSer FOR ttCustomer.
DEFINE DATASET dsRef REFERENCE-ONLY FOR ttCustomer.
DEFINE DATASET dsNs NAMESPACE-URI "http://example.com" NAMESPACE-PREFIX "ex" FOR ttCustomer.
DEFINE DATASET dsXml XML-NODE-NAME "cust" SERIALIZE-NAME "custNode" XML-NODE-TYPE "HIDDEN" SERIALIZE-HIDDEN FOR ttCustomer.
DEFINE DATASET dsRel FOR ttParent, ttChild DATA-RELATION FOR ttParent, ttChild RELATION-FIELDS (parentId, childId).
DEFINE DATASET dsRelNested FOR ttParent, ttChild DATA-RELATION FOR ttParent, ttChild RELATION-FIELDS (parentId, childId) NESTED FOREIGN-KEY-HIDDEN.
DEFINE DATASET dsRelRepos FOR ttParent, ttChild DATA-RELATION FOR ttParent, ttChild RELATION-FIELDS (parentId, childId) REPOSITION.
DEFINE DATASET dsRelInactive FOR ttParent, ttChild DATA-RELATION rel1 FOR ttParent, ttChild RELATION-FIELDS (parentId, childId) NOT-ACTIVE.
DEFINE DATASET dsRelRec FOR ttParent, ttChild DATA-RELATION FOR ttParent, ttChild RELATION-FIELDS (parentId, childId) RECURSIVE.
DEFINE DATASET dsPid FOR ttParent, ttChild PARENT-ID-RELATION FOR ttParent, ttChild PARENT-ID-FIELD childRecid.
DEFINE DATASET dsPidFields FOR ttParent, ttChild PARENT-ID-RELATION FOR ttParent, ttChild PARENT-ID-FIELD childRecid PARENT-FIELDS-BEFORE (parentName) PARENT-FIELDS-AFTER (parentNote).

/* statements/dde.txt: DDE */
DDE ADVISE 1 START ITEM "x" TIME 5 NO-ERROR.
DDE EXECUTE 1 COMMAND "x" TIME 5 NO-ERROR.
DDE GET 1 TARGET fld ITEM "x" TIME 5 NO-ERROR.
DDE INITIATE 1 FRAME f APPLICATION "app" TOPIC "topic" NO-ERROR.
DDE REQUEST 1 TARGET fld ITEM "x" TIME 5 NO-ERROR.
DDE SEND 1 SOURCE "data" ITEM "x" TIME 5 NO-ERROR.
DDE TERMINATE 1 NO-ERROR.

/* statements/delete.txt: DELETE basic */
DELETE Customer.
DELETE Order.
DELETE ttRecord.
DELETE Customer VALIDATE (Customer.CustNum > 0, "Bad") NO-ERROR.

/* statements/delete.txt: DELETE with qualified name */
DELETE Sports2000.Customer.
DELETE db.TableName.

/* statements/delete.txt: DELETE OBJECT */
DELETE OBJECT hSocket.
DELETE OBJECT hQuery.
DELETE OBJECT myWidget.
DELETE OBJECT hSocket NO-ERROR.
DELETE OBJECT(vObj).
DELETE WIDGET w1, w2 NO-ERROR.

/* statements/delete.txt: DELETE in FOR EACH loop */
FOR EACH Customer WHERE Customer.Balance = 0 EXCLUSIVE-LOCK:
  DELETE Customer.
END.

/* statements/delete.txt: DELETE in transaction */
DO TRANSACTION:
  FIND Customer WHERE Customer.CustNum = 1 EXCLUSIVE-LOCK.
  DELETE Customer.
END.

/* statements/delete.txt: DELETE ALIAS / WIDGET-POOL */
DELETE ALIAS myalias NO-ERROR.
DELETE WIDGET-POOL wp.

/* statements/delete.txt: DELETE - Reference snippets */
FOR EACH Customer:
  DELETE Customer.
END.

DELETE Customer VALIDATE(NOT(CAN-FIND(Order OF Customer)),
"This Customer has outstanding orders and cannot be deleted.").

/* statements/dictionary.txt: DICTIONARY statement */
DICTIONARY.

/* statements/dictionary.txt: DICTIONARY - reference snippet */
DEFINE VARIABLE ans AS LOGICAL NO-UNDO.
DISPLAY "Do you want to access the Dictionary?"
WITH ROW 7 COLUMN 20 NO-LABELS.
UPDATE ans.
IF ans THEN DICTIONARY.

/* statements/disable-triggers.txt: DISABLE TRIGGERS */
DISABLE TRIGGERS FOR DUMP OF wo_mstr.
DISABLE TRIGGERS FOR LOAD OF db.wo_mstr ALLOW-REPLICATION.

/* statements/disable-triggers.txt: DISABLE TRIGGERS - Reference snippet */
DISABLE TRIGGERS FOR DUMP OF Customer.
DISABLE TRIGGERS FOR LOAD OF Customer.

/* statements/disable-triggers.txt: DISABLE TRIGGERS - ALLOW-REPLICATION with DUMP */
DISABLE TRIGGERS FOR DUMP OF db.Customer ALLOW-REPLICATION.

/* statements/disable.txt: DISABLE */
DISABLE ALL.
DISABLE ALL EXCEPT field1.
DISABLE ALL EXCEPT field1 field2.
DISABLE field1.
DISABLE field1 field2 field3.
DISABLE UNLESS-HIDDEN field1.
DISABLE field1 WHEN x > 5.
DISABLE field1 field2 WHEN y = 1.
DISABLE field1 WITH FRAME f1.

/* statements/disable.txt: DISABLE with format, text, and constants */
DISABLE field1 FORMAT "x(10)" WHEN ok
  TEXT(field2 FORMAT "x(5)")
  "CONST" AT 5 BGCOLOR 2 VIEW-AS TEXT
  SKIP.

/* statements/disable.txt: DISABLE - Reference snippet */
DISABLE b_save b_undo WITH FRAME butt-frame.
DISABLE Customer.CreditLimit WITH FRAME cust-info.

/* statements/disable.txt: DISABLE - array access */
DISABLE arr[1].

/* statements/disconnect.txt: DISCONNECT statement */
DISCONNECT mydb.
DISCONNECT mydb NO-ERROR.
DISCONNECT VALUE(cDbName).

/* statements/disconnect.txt: DISCONNECT - VALUE with NO-ERROR */
DISCONNECT VALUE(cDb) NO-ERROR.

/* statements/disconnect.txt: DISCONNECT - Reference snippet */
DISCONNECT mydb.
DISCONNECT VALUE("mydb") NO-ERROR.

/* statements/display.txt: DISPLAY basic */
DISPLAY x.
DISPLAY "Hello".
DISPLAY 123.
DISP SKIP(1) "x".

/* statements/display.txt: DISPLAY multiple items */
DISPLAY x y z.
DISPLAY Customer.Name Customer.Balance.

/* statements/display.txt: DISPLAY with aggregates */
DISPLAY Customer.Balance (TOTAL).

/* statements/display.txt: DISPLAY abbreviated */
DISP x.
disp Customer.Name.

/* statements/display.txt: DISPLAY with expressions */
DISPLAY x + y.
DISPLAY "Total: " + STRING(amount).
DISPLAY Item.Qty * Item.Price LABEL "Extended".

/* statements/display.txt: DISPLAY with function calls */
DISPLAY STRING(TODAY).
DISPLAY CAPS(Customer.Name).
DISPLAY SUBSTRING(str, 1, 5).

/* statements/display.txt: DISPLAY record with EXCEPT and frame phrase */
DISPLAY Customer EXCEPT Comments PrivateNotes WITH FRAME fCust NO-ERROR.

/* statements/display.txt: DISPLAY with format, WHEN, and @ base-field */
DISPLAY orderTotal FORMAT "->>>,>>9.99" WHEN showTotal @ baseTotal.

/* statements/display.txt: DISPLAY - Reference snippets */
FOR EACH Customer NO-LOCK BY Customer.State BY Customer.Name:
  DISPLAY Customer.State Customer.CustNum Customer.Name.
  FOR EACH Order OF Customer NO-LOCK:
    DISPLAY Order.OrderNum Order.Name Order.ShipDate Order.PromiseDate.
    FOR EACH OrderLine OF Order NO-LOCK, Item OF OrderLine NO-LOCK:
      DISPLAY OrderLine.LineNum Item.ItemName OrderLine.Qty OrderLine.price.
    END.
  END.
END.

FOR EACH Order NO-LOCK, Customer OF Order NO-LOCK:
  DISPLAY Order.OrderNum Customer.Name Order.ShipDate Order.PromiseDate.
  FOR EACH OrderLine OF Order NO-LOCK, Item OF OrderLine NO-LOCK:
    DISPLAY OrderLine.LineNum Item.ItemName OrderLine.Qty OrderLine.Price
      OrderLine.Qty * OrderLine.Price (TOTAL) LABEL "Order-value".
  END.
END.

FOR EACH Customer NO-LOCK:
  DISPLAY Customer.Name SKIP Customer.Address SKIP Customer.Address2 SKIP
    Customer.City + ", " + Customer.State FORMAT "x(16)"
    Customer.PostalCode WHEN Customer.PostalCode NE "" SKIP(2)
    WITH NO-BOX NO-LABELS USE-TEXT.
END.

DISPLAY Customer EXCEPT Customer.Comments WITH FRAME f2.
DISPLAY Customer EXCEPT Customer.Comments WITH BROWSE b1.
DISPLAY Customer.Name IN WINDOW hWin WITH FRAME f1 NO-ERROR.
DISPLAY STREAM s1 Customer.Name.
DISPLAY STREAM-HANDLE hStream Customer.Name.
DISPLAY UNLESS-HIDDEN Customer.Name.
DISPLAY SPACE(2) Customer.Name SKIP(1) Customer.City.

/* statements/display.txt: DISPLAY with frame only */
DISPLAY WITH FRAME a 1 DOWN NO-LABEL OVERLAY.

/* statements/display.txt: DISPLAY - standalone aggregate expression */
DISPLAY (COUNT BY category).
DISPLAY (COUNT TOTAL BY region).

/* statements/do.txt: DO block basic */
DO:
  x = 1.
END.

/* statements/do.txt: DO with loop variable */
DO idx = 1 TO 3:
  x = idx.
END.

DO i = 1 TO 10 BY 2:
  DISPLAY i.
END.

/* statements/do.txt: DO WHILE */
DO WHILE idx < 3:
  idx = idx + 1.
END.

DO WHILE NOT eof:
  x = 1.
END.

/* statements/do.txt: DO WHILE with ON ERROR UNDO THROW */
DO WHILE idx < 3 ON ERROR UNDO, THROW:
  idx = idx + 1.
END.

/* statements/do.txt: DO with ON ERROR UNDO LEAVE */
DO ON ERROR UNDO, LEAVE:
  idx = 1.
END.

/* statements/do.txt: DO with ON STOP UNDO NEXT */
DO ON STOP UNDO, NEXT:
  idx = 3.
END.

/* statements/do.txt: DO with ON QUIT LEAVE */
DO ON QUIT, LEAVE:
  idx = 2.
END.

/* statements/do.txt: DO TRANSACTION */
DO TRANSACTION:
END.

DO TRANSACTION:
  CREATE Customer.
  Customer.Name = "Test".
END.

/* statements/do.txt: DO TRANSACTION WHILE */
DO TRANSACTION WHILE something:get-next():
  something:buffer-copy(something).
END.

/* statements/do.txt: DO TRANS short for TRANSACTION */
DO TRANS:
  x = 1.
END.

/* statements/do.txt: DO loop with TO and trailing WHILE */
DO i = 1 TO 5 WHILE pParam.fields[i] <> "":
  DISPLAY i.
END.

/* statements/do.txt: DO WHILE with ON ENDKEY UNDO RETRY */
DO WHILE TRUE ON ENDKEY UNDO, RETRY:
  MESSAGE "hi".
END.

/* statements/do.txt: DO ON ENDKEY UNDO RETURN NO-APPLY */
DO ON ENDKEY UNDO, RETURN NO-APPLY:
  MESSAGE "x".
END.

/* statements/do.txt: DO with label */
process_block: DO:
  x = 1.
END.

outer: DO i = 1 TO 10:
  inner: DO j = 1 TO 5:
    DISPLAY i j.
  END.
END.

/* statements/do.txt: DO with ON ENDKEY UNDO LEAVE with label */
myloop: DO WHILE TRUE ON ENDKEY UNDO myloop, LEAVE myloop:
  x = x + 1.
END.

/* statements/do.txt: DO with expression TO expression */
DO i = startVal TO endVal:
  DISPLAY i.
END.

DO i = getStart() TO getEnd() BY getStep():
  DISPLAY i.
END.

/* statements/do.txt: DO with empty body using dot terminator */
DO.
END.

/* statements/do.txt: DO FOR with TRANSACTION STOP-AFTER and ON ERROR */
DO FOR some_copy TRANSACTION STOP-AFTER 2 ON ERROR UNDO, THROW:
  a = 5.
END.

/* statements/do.txt: DO FOR with QUERY-TUNING and FRAME options */
DO FOR rec1, rec2 QUERY-TUNING (LOOKAHEAD NO-LOOKAHEAD CACHE-SIZE 10 INDEX-HINT NO-INDEX-HINT SEPARATE-CONNECTION NO-SEPARATE-CONNECTION DEBUG SQL NO-DEBUG JOIN-BY-SQLDB NO-JOIN-BY-SQLDB BIND-WHERE NO-BIND-WHERE) WITH WIDTH 40:
  DISPLAY rec1.
END.

/* statements/do.txt: DO PRESELECT */
DO PRESELECT EACH Customer NO-LOCK:
  DISPLAY Customer.Name.
END.

/* statements/do.txt: DO - Reference snippet */
FOR EACH Customer NO-LOCK:
  DISPLAY Customer.Name Customer.CreditLimit.
  PAUSE 3.
  IF Customer.CreditLimit > 80000 THEN DO:
    Customer.CreditLimit = 80000.
    DISPLAY Customer.Name Customer.CreditLimit.
  END.
END.

/* statements/dos.txt: DOS */
DOS.
DOS SILENT.
DOS NOWAIT.
DOS VALUE("dir").
DOS SILENT VALUE("dir").
DOS NOWAIT VALUE("dir").

/* statements/dos.txt: DOS - Reference snippet */
IF OPSYS = "UNIX" THEN UNIX ls.
ELSE IF OPSYS = "WIN32" THEN DOS dir.
ELSE DISPLAY OPSYS "is an unsupported operating system".

/* statements/down.txt: DOWN statement */
DOWN.
DOWN 1.
DOWN 2 WITH FRAME cust.
DOWN STREAM-HANDLE hOut 3.
DOWN STREAM sOut.

/* statements/down.txt: DOWN - Reference snippet */
FOR EACH Customer NO-LOCK BY Customer.State:
  IF Customer.State <> laststate THEN DO:
    IF laststate <> "" THEN DOWN 1.
    laststate = Customer.State.
  END.
  DISPLAY Customer.CustNum Customer.Name Customer.City Customer.State.
END.

/* statements/empty-statement.txt: EMPTY STATEMENT */
.

/* statements/empty.txt: EMPTY TEMP-TABLE */
EMPTY TEMP-TABLE tt_items.

/* statements/empty.txt: EMPTY TEMP-TABLE - NO-ERROR */
EMPTY TEMP-TABLE tt_items NO-ERROR.

/* statements/enable.txt: ENABLE */
ENABLE ALL.
ENABLE ALL EXCEPT field1.
ENABLE ALL EXCEPT field1 field2.
ENABLE field1.
ENABLE field1 field2 field3.
ENABLE UNLESS-HIDDEN field1.
ENABLE field1 WHEN x > 5.
ENABLE field1 field2 WHEN y = 1.
ENABLE field1 WITH FRAME f1.
ENABLE field1 IN WINDOW w1.

/* statements/enable.txt: ENABLE with format, text, and constants */
ENABLE field1 FORMAT "x(10)" WHEN ok
  TEXT(field2 FORMAT "x(5)")
  "CONST" AT 5 BGCOLOR 2 VIEW-AS TEXT
  SKIP.

/* statements/enable.txt: ENABLE - Reference snippet */
ENABLE Customer.CustNum WITH FRAME cust-info.
ENABLE b_quit WITH FRAME butt-frame.
ENABLE ALL WITH FRAME butt-frame.

/* statements/enable.txt: ENABLE - array access */
ENABLE arr[1].

/* statements/enum.txt: ENUM statement */
ENUM Weather:
  define ENUM Rainy
              Default = Sunny
              Cloudy
              Snowy
              Apocalyptic.
END ENUM.

ENUM Permission FLAGS:
    DEFINE ENUM None = 0
                Read
                Write
                Update = Write
                ReadWrite = Read,Write
                Create
                Delete
                Execute.
END ENUM.

ENUM Direction:
    DEFINE ENUM North
                South
                East
                West.
END ENUM.

ENUM Status:
  DEFINE ENUM New = 1
              Open
              Closed = Open
              Archived = New,Closed.
END ENUM.

/* statements/enum.txt: ENUM - Reference snippets and split DEFINE ENUM */
ENUM Direction:
  DEFINE ENUM North
  South.
  DEFINE ENUM East
  West.
END ENUM.

ENUM Permission FLAGS:
  DEFINE ENUM None = 0
  Read = 0x01
  Write = 0x02
  Update = 0x02
  ReadWrite = 0x03
  Create = 0x04
  Delete = 0x08
  Execute = 0x10.
END ENUM.

/* statements/error-scope.txt: ERROR SCOPE */
BLOCK-LEVEL ON ERROR UNDO, THROW.
ROUTINE-LEVEL ON ERROR UNDO, THROW.

/* statements/error-scope.txt: ERROR SCOPE with following definitions */
BLOCK-LEVEL ON ERROR UNDO, THROW.
DEFINE VARIABLE x AS INTEGER.

/* statements/error-scope.txt: ERROR SCOPE - Reference snippets */
BLOCK-LEVEL ON ERROR UNDO, THROW.
ROUTINE-LEVEL ON ERROR UNDO, THROW.

/* statements/event.txt: EVENT basic definition */
CLASS X:
  DEFINE EVENT onCustomerChanged SIGNATURE VOID ().
END.

/* statements/event.txt: EVENT with modifiers */
CLASS X:
  DEFINE PUBLIC STATIC EVENT onSync SIGNATURE VOID ().
  DEFINE PROTECTED ABSTRACT OVERRIDE EVENT onAbstract SIGNATURE VOID (INPUT reason AS CHARACTER).
END.

/* statements/event.txt: EVENT with parameters */
CLASS X:
  DEFINE EVENT onDataChanged SIGNATURE VOID (
    INPUT sender AS CLASS Progress.Lang.Object,
    INPUT args AS CLASS MyEventArgs
  ).
END.

/* statements/event.txt: EVENT with DELEGATE */
CLASS X:
  DEFINE EVENT onProgress DELEGATE CLASS System.EventHandler.
END.

/* statements/event.txt: EVENT static definition */
CLASS X:
  DEFINE STATIC EVENT onLog SIGNATURE VOID ().
END.

/* statements/event.txt: EVENT - PRIVATE modifier */
CLASS X:
  DEFINE PRIVATE EVENT onPrivate SIGNATURE VOID ().
END.

/* statements/event.txt: EVENT - PACKAGE-PRIVATE modifier */
CLASS X:
  DEFINE PACKAGE-PRIVATE EVENT onPackage SIGNATURE VOID (INPUT id AS INTEGER).
END.

/* statements/event.txt: EVENT - PROTECTED modifier */
CLASS X:
  DEFINE PROTECTED EVENT onProtected SIGNATURE VOID ().
END.

/* statements/event.txt: EVENT - PACKAGE-PROTECTED modifier */
CLASS X:
  DEFINE PACKAGE-PROTECTED EVENT onPackageProt SIGNATURE VOID ().
END.

/* statements/event.txt: EVENT - PUBLIC modifier (default) */
CLASS X:
  DEFINE EVENT onPublic SIGNATURE VOID ().
END.

/* statements/event.txt: EVENT - STATIC modifier only */
CLASS X:
  DEFINE STATIC EVENT onStatic SIGNATURE VOID ().
  DEFINE STATIC PRIVATE EVENT onStaticPriv SIGNATURE VOID ().
END.

/* statements/event.txt: EVENT - ABSTRACT modifier */
CLASS X:
  DEFINE ABSTRACT EVENT onAbstract SIGNATURE VOID (INPUT data AS CHARACTER).
  DEFINE PUBLIC ABSTRACT EVENT onPubAbs SIGNATURE VOID ().
END.

/* statements/event.txt: EVENT - OVERRIDE modifier */
CLASS X:
  DEFINE OVERRIDE EVENT onOverride SIGNATURE VOID ().
  DEFINE PROTECTED OVERRIDE EVENT onProtOverride SIGNATURE VOID ().
END.

/* statements/event.txt: EVENT - Multiple parameters VOID */
CLASS X:
  DEFINE EVENT onMultiParams SIGNATURE VOID (
    INPUT a AS INTEGER,
    INPUT b AS CHARACTER,
    INPUT c AS LOGICAL
  ).
END.

/* statements/event.txt: EVENT - OUTPUT parameters */
CLASS X:
  DEFINE EVENT onOutput SIGNATURE VOID (
    OUTPUT result AS INTEGER,
    OUTPUT message AS CHARACTER
  ).
END.

/* statements/event.txt: EVENT - INPUT-OUTPUT parameters */
CLASS X:
  DEFINE EVENT onInOut SIGNATURE VOID (
    INPUT-OUTPUT value AS DECIMAL,
    INPUT-OUTPUT name AS CHARACTER
  ).
END.

/* statements/event.txt: EVENT - DELEGATE with generic types */
CLASS X:
  DEFINE EVENT onClick DELEGATE CLASS System.EventHandler<System.EventArgs>.
END.

/* statements/event.txt: EVENT - DELEGATE with simple CLASS */
CLASS X:
  DEFINE EVENT onUpdate DELEGATE CLASS MyDelegate.
  DEFINE EVENT onAction DELEGATE CLASS Action.
END.

/* statements/event.txt: EVENT - No parameters VOID */
CLASS X:
  DEFINE EVENT onSimple SIGNATURE VOID ().
END.

/* statements/event.txt: EVENT - No SIGNATURE DELEGATE */
CLASS X:
  DEFINE EVENT onLogEntry DELEGATE CLASS Logger.LogHandler.
END.

/* statements/event.txt: EVENT - Modifiers combination */
CLASS X:
  DEFINE PRIVATE STATIC EVENT onMsg SIGNATURE VOID (INPUT msg AS CHARACTER).
  DEFINE PROTECTED OVERRIDE EVENT onValue SIGNATURE VOID (INPUT val AS INTEGER).
  DEFINE PUBLIC STATIC ABSTRACT EVENT onInit SIGNATURE VOID (INPUT id AS INTEGER).
END.

/* statements/event.txt: EVENT - Minimal */
CLASS X:
  DEFINE EVENT e SIGNATURE VOID ().
  DEF EVENT e2 DELEGATE cls.
END.

/* statements/event.txt: EVENT - Reference snippets */
CLASS X:
  DEFINE PUBLIC EVENT NewCustomer SIGNATURE VOID ( INPUT pcCustName AS CHARACTER ).
  DEFINE EVENT onSimple SIGNATURE VOID ( ).
  DEFINE EVENT onDelegate DELEGATE CLASS System.EventHandler.
END.

/* statements/export.txt: EXPORT */
EXPORT a b c.
EXPORT DELIMITER "," Customer EXCEPT CustNum CustName NO-LOBS.
EXPORT STREAM-HANDLE hOut memptrBuf.

/* statements/export.txt: EXPORT - Reference snippets */
OUTPUT TO customer.d.
FOR EACH Customer NO-LOCK:
  EXPORT Customer.
END.
OUTPUT CLOSE.

OUTPUT TO custdump2.
FOR EACH Customer NO-LOCK:
  EXPORT DELIMITER ";" Customer.CustNum Customer.Name Customer.CreditLimit.
END.
OUTPUT CLOSE.

EXPORT tt1 EXCEPT f2.
EXPORT z.
EXPORT STREAM s1 Customer.Name.
EXPORT STREAM-HANDLE hOut memptrBuf.

/* statements/expression.txt: EXPRESSION STATEMENT */
doWork().
myFunc(1, "x") NO-ERROR.

/* statements/expression.txt: NEW expression - record buffer check forms */
IF NEW(Customer) THEN RETURN.
IF NOT NEW Order THEN RETURN.

/* statements/expression.txt: ENTERED expression */
IF wfeven ENTERED THEN RETURN.
IF NOT wfeven ENTERED THEN LEAVE.

/* statements/expression.txt: NOT ENTERED expression */
IF wfeven NOT ENTERED THEN RETURN.
IF NOT ENTERED wfeven THEN RETURN.

/* statements/expression.txt: ENTERED expression - reversed order */
IF ENTERED wfeven THEN RETURN.

/* statements/finally.txt: FINALLY */
FINALLY:
  MESSAGE "Cleanup".
END.

FINALLY:
  DELETE OBJECT hBuffer.
  DELETE OBJECT hQuery.
END FINALLY.

/* statements/finally.txt: FINALLY with different body statements */
FINALLY:
  DELETE OBJECT hBuffer.
  CLOSE QUERY qCustomer.
  MESSAGE "Cleanup complete".
END.

/* statements/finally.txt: FINALLY with complex body */
FINALLY:
  DELETE OBJECT hQuery.
  DELETE OBJECT hBuffer.
  OUTPUT CLOSE.
END.

/* statements/finally.txt: FINALLY - Reference snippets */
DO ON ERROR UNDO, LEAVE:
  FIND Customer WHERE CustNum = 1000.
  MESSAGE "This message never appears because of ERROR condition.".
  FINALLY:
    MESSAGE "Inside FINALLY block." VIEW-AS ALERT-BOX BUTTONS OK.
  END FINALLY.
END.
MESSAGE "Out of DO block." VIEW-AS ALERT-BOX BUTTONS OK.

DO ON ERROR UNDO, LEAVE:
  FIND Customer WHERE CustNum = 1000.
  CATCH eSysError AS Progress.Lang.SysError:
    MESSAGE "Inside CATCH block." VIEW-AS ALERT-BOX BUTTONS OK.
  END CATCH.
  FINALLY:
    MESSAGE "Inside FINALLY block." VIEW-AS ALERT-BOX BUTTONS OK.
  END FINALLY.
END.
MESSAGE "Out of DO block." VIEW-AS ALERT-BOX BUTTONS OK.

/* statements/find.txt: FIND basic */
FIND Customer.
FIND Customer NO-LOCK.
FIND Customer EXCLUSIVE-LOCK.
FIND Customer SHARE-LOCK.
FIND Customer EXCLUSIVE.
FIND Customer SHARE.

/* statements/find.txt: FIND with WHERE clause */
FIND customer WHERE customer.id = 2 NO-LOCK.
FIND Customer WHERE Customer.Name = "John" AND Customer.Balance > 0.

/* statements/find.txt: FIND FIRST/LAST */
FIND FIRST Customer NO-LOCK.
FIND LAST Order NO-LOCK.
FIND FIRST DebtorShipTo WHERE DebtorShipTo.Code = par_code NO-LOCK NO-ERROR.

/* statements/find.txt: FIND CURRENT */
FIND CURRENT Order NO-ERROR.
FIND CURRENT Customer EXCLUSIVE-LOCK.

/* statements/find.txt: FIND with OF clause */
FIND Contact OF Address EXCLUSIVE-LOCK NO-ERROR NO-WAIT.
FIND Order OF Customer NO-LOCK.

/* statements/find.txt: FIND with USE-INDEX */
FIND FIRST det WHERE det.id = 1 USE-INDEX idx_id NO-LOCK NO-ERROR.
FIND Customer USE-INDEX CustNum.

/* statements/find.txt: FIND with NO-PREFETCH */
FIND FIRST Customer NO-LOCK NO-PREFETCH.

/* statements/find.txt: FIND with USING clause */
FIND Customer USING Customer.CustNum NO-ERROR.
FIND Order USING Order.OrderNum EXCLUSIVE-LOCK.

/* statements/find.txt: FIND with qualified table name */
FIND Sports2000.Customer NO-LOCK.
FIND db.tablename WHERE tablename.field = 1.

/* statements/find.txt: FIND with multiple options combined */
FIND FIRST Customer WHERE Customer.Balance > 1000 USE-INDEX Balance NO-LOCK NO-ERROR NO-WAIT.

/* statements/find.txt: FIND - Reference snippets */
FIND Customer 1.
PROMPT-FOR Customer.CustNum.
FIND Customer USING Customer.CustNum.

REPEAT:
  PROMPT-FOR Item.ItemNum.
  FIND Item USING Item.ItemNum.
  DISPLAY Item.ItemNum Item.ItemName.
  REPEAT:
    FIND NEXT OrderLine OF Item.
    FIND Order OF OrderLine.
    FIND Customer WHERE Customer.CustNum = Order.CustNum.
    DISPLAY Customer.Name Order.OrderNum OrderLine.Qty (TOTAL).
  END.
END.

DEFINE VARIABLE start-name NO-UNDO LIKE Customer.Name.
REPEAT:
  SET start-name.
  FIND FIRST Customer WHERE Customer.Name >= start-name.
  REPEAT:
    DISPLAY Customer.Name.
    FIND NEXT Customer USE-INDEX name.
  END.
END.

/* statements/fix-codepage.txt: FIX-CODEPAGE */
FIX-CODEPAGE(mData) = "UTF-8".
FIX-CODEPAGE(mRaw) = cCodepage.

/* statements/fix-codepage.txt: FIX-CODEPAGE - object access codepage */
FIX-CODEPAGE(mData) = SESSION:CHARSET.

/* statements/fix-codepage.txt: FIX-CODEPAGE - Reference snippets */
FIX-CODEPAGE(mData) = "UTF-8".
FIX-CODEPAGE(mData) = ?.

/* statements/for.txt: FOR EACH basic */
FOR EACH Customer:
  DISPLAY Customer.Name.
END.

/* statements/for.txt: FOR EACH with GROUP BY */
FOR EACH ttTransakcje NO-LOCK GROUP BY ttTime DESC:
  PUT SKIP.
END.

/* statements/for.txt: FOR EACH with WHERE clause */
FOR EACH customer WHERE customer.id = 1 NO-LOCK:
  DISPLAY customer.name.
END.

/* statements/for.txt: FOR EACH with ON ERROR UNDO THROW */
FOR EACH tFcMessages ON ERROR UNDO, THROW:
  DISPLAY tFcMessages.tcFcMessage.
END.

/* statements/for.txt: FOR EACH with USE-INDEX and BREAK BY */
FOR EACH trans_hist WHERE trans_hist.domain = "ZMD" NO-LOCK USE-INDEX idxTrans BREAK BY trans_hist.line BY trans_hist.part:
  DISPLAY trans_hist.line.
END.

/* statements/for.txt: FOR EACH with BY clause and DESC */
FOR EACH order_hdr NO-LOCK BY order_hdr.order_num DESC:
  DISPLAY order_hdr.order_num.
END.

/* statements/for.txt: FOR EACH with frame clause */
FOR EACH item NO-LOCK WITH FRAME fr WIDTH 120:
  PUT UNFORMATTED item.item_id SKIP.
END.

/* statements/for.txt: FOR EACH with label */
outer_loop: FOR EACH item_mstr NO-LOCK:
  DISPLAY item_mstr.item_code.
END.

/* statements/for.txt: FOR EACH with ON ENDKEY UNDO RETRY */
FOR EACH Customer ON ENDKEY UNDO, RETRY:
  DISPLAY Customer.Name.
END.

/* statements/for.txt: FOR EACH with EXCLUSIVE-LOCK */
FOR EACH ld_det WHERE ld_domain = "ZMD" EXCLUSIVE-LOCK:
  DISPLAY ld_det.ld_domain.
END.

/* statements/for.txt: FOR EACH with optional WHERE and BY */
FOR EACH x WHERE BY x:
  DISPLAY x.
END.

/* statements/for.txt: FOR EACH with SHARE-LOCK and NO-PREFETCH */
FOR EACH share_lock_rec SHARE-LOCK NO-PREFETCH:
  DISPLAY share_lock_rec.share_id.
END.

/* statements/for.txt: FOR FIRST */
FOR FIRST Customer NO-LOCK:
  DISPLAY Customer.Name.
END.

/* statements/for.txt: FOR LAST */
FOR LAST Order NO-LOCK:
  DISPLAY Order.OrderNum.
END.

/* statements/for.txt: FOR EACH with multiple tables (join) */
FOR EACH Customer NO-LOCK, EACH Order OF Customer NO-LOCK:
  DISPLAY Customer.Name Order.OrderNum.
END.

/* statements/for.txt: FOR EACH with complex WHERE and multiple BY */
FOR EACH Customer NO-LOCK WHERE Customer.Balance > 0 AND Customer.State = "NY" BY Customer.Name BY Customer.Balance DESC:
  DISPLAY Customer.Name Customer.Balance.
END.

/* statements/for.txt: FOR EACH FIRST/LAST in join */
FOR EACH Customer NO-LOCK, FIRST Order OF Customer NO-LOCK:
  DISPLAY Customer.Name Order.OrderNum.
END.

/* statements/for.txt: FOR variable loops */
FOR i = 1 TO 10:
  DISPLAY i.
END.

FOR i = 1 TO 100 BY 5:
  DISPLAY i.
END.

/* statements/for.txt: FOR WHILE and STOP-AFTER */
FOR EACH Customer WHILE x > 5:
  DISPLAY Customer.
END.

FOR EACH Customer STOP-AFTER 30:
  DISPLAY Customer.
END.

/* statements/for.txt: FOR error handlers */
FOR EACH Customer ON ERROR UNDO, LEAVE:
  DISPLAY Customer.
END.

FOR EACH Customer ON QUIT UNDO, LEAVE:
  DISPLAY Customer.
END.

FOR EACH Customer ON STOP UNDO, LEAVE:
  DISPLAY Customer.
END.

/* statements/for.txt: FOR - Reference snippets */
FOR EACH Customer NO-LOCK BY Customer.CreditLimit:
  DISPLAY Customer.
  LEAVE.
END.

FOR EACH Customer NO-LOCK WHERE Customer.CustNum < 12 BY Customer.State:
  DISPLAY Customer.CustNum Customer.Name Customer.City Customer.State.
END.

FOR EACH Customer NO-LOCK, EACH Order OF Customer NO-LOCK,
     EACH OrderLine OF Order NO-LOCK, Item OF OrderLine NO-LOCK
     BY Order.PromiseDate BY Customer.CustNum BY OrderLine.LineNum:
  DISPLAY Order.PromiseDate Customer.CustNum Order.OrderNum
    OrderLine.LineNum Item.ItemNum Item.ItemName.
END.

FOR EACH Customer NO-LOCK, LAST Order OF Customer:
  DISPLAY Customer.CustNum Customer.Name Order.OrderNum Order.OrderDate
    Order.Instructions.
  PAUSE 1 NO-MESSAGE.
  Order.Instructions = "Last order".
  DISPLAY Order.Instruction.
END.

/* statements/form.txt: FORM basic */
FORM customer-name.
FORM customer-name customer-balance.
FORM customer-name LABEL "Customer Name".
FORM customer-name FORMAT "x(30)".
FORM customer-name VIEW-AS FILL-IN.

/* statements/form.txt: FORM with expressions */
FORM customer-name customer-balance + 100.
FORM customer-name customer-id LABEL "ID".

/* statements/form.txt: FORM with formatting elements */
FORM customer-name SKIP SPACE.
FORM customer-name SKIP(1) SPACE(2).

/* statements/form.txt: FORM with frame phrase */
FORM customer-name WITH FRAME A.
FORM customer-name customer-balance WITH FRAME B.
FORM WITH FRAME only DOWN WIDTH 80.
FORM customer-name LABEL {us/t0/t001.i} FORMAT "x(10)".
FORM customer-name WITH SIDE-LABELS WITH FRAME cForm.

/* statements/form.txt: FORM with MENU item */
FORM Menu NO-LABEL WITH FRAME a SIDE-LABELS.

/* statements/form.txt: FORM - Reference snippets */
REPEAT FOR Customer:
  FORM
    Customer.Name COLON 10 Customer.Phone COLON 50
    Customer.Address COLON 10 Customer.SalesRep COLON 50 SKIP
    Customer.City COLON 10 NO-LABEL Customer.State NO-LABEL
    Customer.PostalCode NO-LABEL
    WITH SIDE-LABELS 1 DOWN CENTERED.
  PROMPT-FOR Customer.CustNum WITH FRAME cnum SIDE-LABELS CENTERED.
  FIND Customer USING Customer.CustNum.
  UPDATE Customer.Name Customer.Address Customer.City Customer.State
    Customer.PostalCode Customer.Phone Customer.SalesRep.
END.

DEFINE VARIABLE ix AS INTEGER NO-UNDO FORMAT ">9".
FORM HEADER "This is the header - ix is" ix
  WITH FRAME a ROW ix COLUMN ix ix DOWN.
DO ix = 1 TO 8 WITH FRAME a:
  DISPLAY ix.
  HIDE FRAME a.
END.

/* statements/frame.txt: FRAME - Basic Definition */
DEFINE FRAME f1 Customer.Name Customer.Address.
DEF FRAME f2 Customer.CustNum Sales.Order.OrderNum.

/* statements/frame.txt: FRAME - field with array subscript */
DEFINE FRAME f1 tbl.field[1] WITH FRAME f1.

/* statements/frame.txt: FRAME - EXCEPT syntax */
DEFINE FRAME fExcept Customer EXCEPT Comments PrivateNotes.
DEF FRAME fOrder Sales.Order EXCEPT Status HiddenFlag.

/* statements/frame.txt: FRAME - String Items */
DEFINE FRAME strings
  "Header: " Customer.Name
  "Record ID: " Customer.CustNum
  "Total: " Sales.Order.Total.

/* statements/frame.txt: FRAME - SPACE clause */
DEFINE FRAME space1 SPACE "   " 10 5.
DEF FRAME space2 SPACE.

/* statements/frame.txt: FRAME - SKIP clause */
DEFINE FRAME skip1 SKIP 3.
DEF FRAME skip2 SKIP.

/* statements/frame.txt: FRAME - HEADER with string */
DEFINE FRAME headered HEADER "Customer Header".

/* statements/frame.txt: FRAME - BACKGROUND with SPACE */
DEFINE FRAME bg1
  BACKGROUND SPACE 10.
  Customer.Name.

/* statements/frame.txt: FRAME - WITH CENTERED */
DEFINE FRAME centered Customer.CustNum WITH CENTERED.

/* statements/frame.txt: FRAME - WITH SIZE */
DEFINE FRAME sized Customer.Name Customer.Address WITH SIZE 80 BY 20.

/* statements/frame.txt: FRAME - WITH DOWN */
DEFINE FRAME down Customer.CustNum WITH 10 DOWN.

/* statements/frame.txt: FRAME - WITH WIDTH */
DEFINE FRAME width Customer.Name WITH WIDTH 60.

/* statements/frame.txt: FRAME - WITH OVERLAY */
DEFINE FRAME overlay Sales.Order.OrderNum WITH OVERLAY.

/* statements/frame.txt: FRAME - WITH ROW and COLUMN */
DEFINE FRAME positioned Customer.CustNum WITH ROW 5 COLUMN 10.

/* statements/frame.txt: FRAME - WITH NO-LABELS */
DEFINE FRAME noLabels Customer.CustNum WITH NO-LABELS.

/* statements/frame.txt: FRAME - WITH SIDE-LABELS */
DEFINE FRAME sideLabels Customer.CustNum WITH SIDE-LABELS.

/* statements/frame.txt: FRAME - String with AT phrase COLUMN */
DEFINE FRAME atCol
  "Name: " AT COLUMN OF Customer.Name Customer.Name
  "ID: " AT COLUMN OF Customer.CustNum Customer.CustNum.

/* statements/frame.txt: FRAME - String with AT phrase ROW */
DEFINE FRAME atRow
  "Record: " AT ROW OF Customer.CustNum Customer.CustNum.

/* statements/frame.txt: FRAME - AT phrase simple */
DEFINE FRAME atSimple Customer.CustNum AT COLUMN 5.
DEF FRAME atSimple2 "Label: " Customer.Name AT ROW 2 COLUMN 10.

/* statements/frame.txt: FRAME - Constant name with AT phrase */
DEFINE FRAME {&FRAME_NAME} bPolicy AT COLUMN 2 ROW 2.

/* statements/frame.txt: FRAME - TO phrase on string */
DEFINE FRAME toPhrase
  Customer.Name TO 40
  Customer.Address TO 50.

/* statements/frame.txt: FRAME - String with BGCOLOR */
DEFINE FRAME strBg
  "Header" BGCOLOR 7
  Customer.Name.

/* statements/frame.txt: FRAME - String with DCOLOR */
DEFINE FRAME strDc
  "Label" DCOLOR 5
  Customer.CustNum.

/* statements/frame.txt: FRAME - String with FGCOLOR */
DEFINE FRAME strFg
  "Text" FGCOLOR 15
  Customer.Name.

/* statements/frame.txt: FRAME - String with PFCOLOR */
DEFINE FRAME strPf
  "Prompt" PFCOLOR 3
  Customer.CustNum.

/* statements/frame.txt: FRAME - String with FONT */
DEFINE FRAME strFont
  "Title" FONT 4
  Customer.Name.

/* statements/frame.txt: FRAME - String form item simple */
DEFINE FRAME fStr "Test".

/* statements/frame.txt: FRAME - NEW SHARED */
DEFINE NEW SHARED FRAME sharedF Customer.CustNum.
DEF NEW SHARED FRAME sharedF2 Customer.Name Customer.Address.

/* statements/frame.txt: FRAME - PRIVATE */
DEFINE PRIVATE FRAME privF Customer.CustNum.

/* statements/frame.txt: FRAME - Multiple options combined */
DEFINE FRAME combined
  Customer.CustNum
  Customer.Name BGCOLOR 7 FGCOLOR 15
  WITH SIZE 80 BY 20 10 DOWN CENTERED.

/* statements/frame.txt: FRAME - Minimal */
DEFINE FRAME f field1.
DEF FRAME frame field1.

/* statements/frame.txt: FRAME - Reference snippets */
DEFINE VARIABLE bal-avail LIKE Customer.Balance COLUMN-LABEL "Available!Credit" NO-UNDO.
DEFINE FRAME cust-bal
  Customer.CustNum
  Customer.Name FORMAT "X(20)"
  Customer.CreditLimit LABEL "Limit"
  Customer.Balance
  bal-avail
  WITH CENTERED ROW 3 TITLE "Available Customer Credit" USE-TEXT.
FOR EACH Customer NO-LOCK WITH FRAME cust-bal:
  DISPLAY
    Customer.CustNum
    Customer.Name
    Customer.CreditLimit
    Customer.Balance
    Customer.CreditLimit - Customer.Balance
    @ bal-avail.
END.

DEFINE BUTTON b_dtl LABEL "Detail".
DEFINE BUTTON b_next LABEL "Next".
DEFINE BUTTON b_quit LABEL "Quit" AUTO-ENDKEY.
DEFINE FRAME cust-info
  Customer.CustNum
  Customer.Name FORMAT "X(20)"
  Customer.Phone
  WITH CENTERED ROW 4.
DEFINE FRAME cust-dtl
  Customer EXCEPT Customer.CustNum Customer.Name Customer.Phone
  WITH SIDE-LABELS ROW 9 WIDTH 100.
DEFINE FRAME butt-frame
  b_dtl b_next b_quit
  WITH ROW 1.
ON CHOOSE OF b_dtl
  DISPLAY Customer EXCEPT Customer.CustNum Customer.Name Customer.Phone
  WITH FRAME cust-dtl.

DEFINE NEW SHARED FRAME cust-frame.
DEFINE NEW SHARED VARIABLE csz AS CHARACTER FORMAT "x(29)".
DEFINE NEW SHARED BUFFER xcust FOR Customer.
FOR EACH xcust WHERE xcust.CustNum <= 20:
  DISPLAY xcust.Name xcust.Phone xcust.Address xcust.SalesRep
    xcust.City + ", " + xcust.State + " " + xcust.PostalCode @ csz
    xcust.CreditLimit WITH FRAME cust-frame.
END.

DEFINE QUERY custq FOR Customer.
DEFINE BUTTON bprev LABEL "<".
DEFINE BUTTON bnext LABEL ">".
DEFINE FRAME cust-fr SKIP(.5)
  SPACE(8) Customer.Name Customer.CustNum Customer.SalesRep
  Customer.Comments AT COLUMN 6 ROW 13.5
  WITH SIDE-LABELS TITLE "Customer Data" SIZE 80 BY 15 VIEW-AS DIALOG-BOX.
DEFINE FRAME cont-fr SKIP(.5)
  Customer.Address COLON 17 SKIP
  Customer.Address2 COLON 17 SKIP
  Customer.City COLON 17 SKIP
  Customer.State COLON 17 SKIP
  Customer.PostalCode COLON 17 SKIP
  Customer.Country COLON 17 SKIP
  Customer.Contact COLON 17 SKIP
  Customer.Phone COLON 17
  WITH SIDE-LABELS TITLE "Contact Informaion" SIZE 40 BY 10 AT COLUMN 1 ROW 3.
DEFINE FRAME ctrl-fr SKIP(.12)
  SPACE(4) bprev bnext
  WITH TITLE "PREVIOUS/NEXT" SIZE 15 BY 2 AT COLUMN 53 ROW 10.5.
DEFINE FRAME acct-fr SKIP(.5)
  Customer.Balance COLON 15 SKIP
  Customer.CreditLimit COLON 15 SKIP
  Customer.Discount COLON 15 SKIP
  Customer.Terms COLON 15
  WITH SIDE-LABELS TITLE "Account Information"
  SIZE 38.85 BY 6 AT COLUMN 41 ROW 3.
FRAME cont-fr:FRAME = FRAME cust-fr:HANDLE.
FRAME acct-fr:FRAME = FRAME cust-fr:HANDLE.
FRAME ctrl-fr:FRAME = FRAME cust-fr:HANDLE.
OPEN QUERY custq PRESELECT EACH Customer BY Customer.Name.
GET FIRST custq.
ENABLE ALL WITH FRAME ctrl-fr.
WAIT-FOR WINDOW-CLOSE OF FRAME cust-fr.

/* statements/function.txt: FUNCTION DEFINITION */
DEFINE FUNCTION doThing RETURNS INTEGER.

FUNCTION computeTotal RETURNS DECIMAL (INPUT qty AS INTEGER, INPUT price AS DECIMAL):
  RETURN qty * price.
END FUNCTION.

/* statements/function.txt: FUNCTION - RETURN keyword */
DEFINE FUNCTION testFunc1 RETURN CHARACTER.
FUNCTION testFunc2 RETURN LOGICAL (INPUT flag AS CHARACTER).
  RETURN FALSE.
END.

/* statements/function.txt: FUNCTION - with CLASS return type */
FUNCTION getHandle RETURNS CLASS Progress.Lang.Object (INPUT id AS INTEGER).
  RETURN DYNAMIC-FUNCTION("getObject", id).
END FUNCTION.

/* statements/function.txt: FUNCTION - EXTENT parameters */
FUNCTION processArray RETURNS LOGICAL (INPUT arr AS INTEGER EXTENT 10).
  RETURN TRUE.
END FUNCTION.

/* statements/function.txt: FUNCTION - NO-UNDO parameters */
FUNCTION getBuffer RETURNS HANDLE (INPUT name AS CHARACTER NO-UNDO).
  RETURN BUFFER name:HANDLE.
END.

/* statements/function.txt: FUNCTION - INPUT-OUTPUT parameters */
FUNCTION updateValue RETURNS CHARACTER (INPUT-OUTPUT val AS CHARACTER NO-UNDO).
  val = "Updated".
  RETURN val.
END FUNCTION.

/* statements/function.txt: FUNCTION - OUTPUT parameters */
FUNCTION calc RETURNS INTEGER (INPUT a AS INTEGER, OUTPUT b AS INTEGER).
  b = a + 10.
  RETURN a.
END.

/* statements/function.txt: FUNCTION - LIKE parameter type */
FUNCTION copyField RETURNS LOGICAL (INPUT src LIKE Customer.CustNum, OUTPUT dest AS INTEGER NO-UNDO).
  dest = src.
  RETURN TRUE.
END.

/* statements/function.txt: FUNCTION - Multiple parameters */
FUNCTION compute RETURNS DECIMAL (
  INPUT a AS INTEGER,
  INPUT b AS DECIMAL,
  INPUT c AS CHARACTER NO-UNDO
).
  RETURN DECIMAL(a).
END.

/* statements/function.txt: FUNCTION - EXTENT with identifier size */
FUNCTION listValues RETURNS CHARACTER (INPUT vals AS INTEGER EXTENT ?).
  RETURN STRING(vals).
END.

/* statements/function.txt: FUNCTION - EXTENT with constant */
FUNCTION getData RETURNS CHARACTER (INPUT data AS DATE EXTENT {&MAX}).
  RETURN "".
END.

/* statements/function.txt: FUNCTION - Minimal */
DEFINE FUNCTION f RETURNS INTEGER.
DEFINE FUNCTION f2 RETURN LOGICAL ().

/* statements/function.txt: FUNCTION - DELEGATE return */
FUNCTION getHandler RETURNS CLASS Progress.Util.EventHandler (INPUT id AS INTEGER).
  RETURN DYNAMIC-FUNCTION("getHandler").
END.

/* statements/function.txt: FUNCTION - NO-UNDO on forward definition */
DEFINE FUNCTION getInfo RETURNS HANDLE (INPUT id AS INTEGER NO-UNDO).

/* statements/function.txt: FUNCTION - LIKE with qualified name */
FUNCTION copyBuffer RETURNS LOGICAL (INPUT src LIKE Sales.Customer.CustomerName, OUTPUT dest AS CHARACTER).
  RETURN TRUE.
END.

/* statements/function.txt: FUNCTION - Complex body with multiple statements */
FUNCTION process RETURNS CHARACTER (INPUT id AS INTEGER NO-UNDO).
  IF id > 0 THEN DO:
    RETURN DYNAMIC-FUNCTION("getString", id).
  END.
  ELSE DO:
    RETURN "".
  END.
END FUNCTION.

/* statements/function.txt: FUNCTION - IN phrase prototype */
FUNCTION getData RETURNS INTEGER (pcFile AS CHAR) IN ContextHandle.

/* statements/function.txt: FUNCTION - FORWARD prototype */
FUNCTION doubler RETURNS INTEGER (INPUT parm1 AS INTEGER) FORWARD.

/* statements/function.txt: FUNCTION - DEFINE FORWARD prototype */
DEFINE FUNCTION fmtId RETURNS CHARACTER (INPUT id AS INTEGER) FORWARD.

/* statements/function.txt: FUNCTION - PRIVATE definition */
FUNCTION secureToken RETURNS CHARACTER PRIVATE (INPUT userId AS INTEGER):
  RETURN STRING(userId).
END FUNCTION.

/* statements/function.txt: FUNCTION - MAP TO IN proc-handle prototype */
FUNCTION calcTotal RETURNS DECIMAL (INPUT orderNum AS INTEGER) MAP TO getTotal IN hOrderProc.

/* statements/function.txt: FUNCTION - IN SUPER prototype */
FUNCTION getDefault RETURNS INTEGER (INPUT customerId AS INTEGER) IN SUPER.

/* statements/function.txt: FUNCTION - Web service operation prototype */
FUNCTION GetCustomer RETURNS CHARACTER (INPUT custNum AS INTEGER) IN hPortType.

/* statements/function.txt: FUNCTION - Reference snippets */
FUNCTION doubler RETURNS INTEGER (INPUT parm1 AS INTEGER):
  RETURN (2 * parm1).
END FUNCTION.

FUNCTION doubler RETURNS INTEGER (INPUT parm1 AS INTEGER) FORWARD.
DISPLAY "doubler(0)=" doubler(0).
DISPLAY "doubler(1)=" doubler(1).
DISPLAY "doubler(2)=" doubler(2).
FUNCTION doubler RETURNS INTEGER (INPUT parm1 AS INTEGER):
  RETURN (2 * parm1).
END FUNCTION.

DEFINE VARIABLE myhand AS HANDLE NO-UNDO.
FUNCTION doubler RETURNS INTEGER (INPUT parm1 AS INTEGER) IN myhand.
RUN src\prodoc\langref\r-udfdef.p PERSISTENT SET myhand.
DISPLAY "doubler(0)=" doubler(0) SKIP
  "doubler(1)=" doubler(1) SKIP
  "doubler(17)=" doubler(17) SKIP.
DELETE PROCEDURE myhand.

FUNCTION fact RETURNS INTEGER (INPUT val AS INTEGER):
  IF val LT 0 THEN RETURN 0.
  IF val LE 1 THEN RETURN 1.
  RETURN val * fact(val - 1).
END.

/* statements/get-key-value.txt: GET-KEY-VALUE */
GET-KEY-VALUE SECTION "general" KEY "theme" VALUE cTheme.
GET-KEY-VALUE SECTION cSection KEY cKey VALUE cValue.
GET-KEY-VALUE SECTION "startup" DEFAULT.

/* statements/get-key-value.txt: GET-KEY-VALUE - VALUE expressions */
GET-KEY-VALUE SECTION VALUE(cSection) KEY VALUE(cKey) VALUE cValue.

/* statements/get-key-value.txt: GET-KEY-VALUE - Reference snippets */
GET-KEY-VALUE SECTION "MYSECTION" KEY "MYKEY" VALUE MYVARIABLE.
GET-KEY-VALUE SECTION "" KEY "MYKEY" VALUE MYVARIABLE.
GET-KEY-VALUE SECTION "MYSECTION" KEY "" VALUE MYVARIABLE.
GET-KEY-VALUE SECTION "MYSECTION" KEY "?" VALUE MYVARIABLE.
GET-KEY-VALUE SECTION "" KEY "" VALUE MYVARIABLE.
GET-KEY-VALUE SECTION "" KEY "?" VALUE MYVARIABLE.
GET-KEY-VALUE SECTION "?" KEY "" VALUE MYVARIABLE.
GET-KEY-VALUE SECTION "?" KEY "?" VALUE MYVARIABLE.
GET-KEY-VALUE SECTION "MYAPP" KEY DEFAULT VALUE MYVARIABLE.

/* statements/get.txt: GET statement */
GET FIRST qCustomer.
GET NEXT qCustomer.
GET PREV qCustomer.
GET LAST qCustomer.
GET CURRENT qCustomer NO-LOCK.
GET NEXT qOrder EXCLUSIVE-LOCK NO-WAIT.
GET FIRST qCustomer SHARE-LOCK.
GET NEXT qCustomer NO-WAIT.

/* statements/get.txt: GET - Reference snippet */
DEFINE QUERY cust-order FOR Customer, Order.
OPEN QUERY cust-order FOR EACH Customer, EACH Order OF Customer.
GET FIRST cust-order.
DO WHILE AVAILABLE Customer:
  DISPLAY Customer.CustNum Customer.Name WITH FRAME cust-info.
  DISPLAY Order WITH FRAME order-info SIDE-LABELS.
  PAUSE.
  GET NEXT cust-order.
END.

/* statements/hide.txt: HIDE statement */
HIDE.
HIDE FRAME myframe.
HIDE MESSAGE.
HIDE ALL.
HIDE ALL NO-PAUSE.
HIDE STREAM s1.
HIDE STREAM-HANDLE hS FRAME f1 NO-PAUSE.

/* statements/hide.txt: HIDE - Reference snippet */
VIEW FRAME x.
DISPLAY "This is frame A." WITH FRAME a ROW 1 COLUMN 60.
DISPLAY "This is frame B." WITH FRAME b ROW 16 COLUMN 10 4 DOWN.
MESSAGE "Make your selection!".
UPDATE "Selection: " selection VALIDATE(0 < selection AND selection < 7,
  "Invalid selection") AUTO-RETURN WITH FRAME x.
IF selection = 1 THEN HIDE FRAME a.
ELSE IF selection = 2 THEN HIDE FRAME b.
ELSE IF selection = 3 THEN HIDE ALL.
ELSE IF selection = 4 THEN HIDE FRAME x.

HIDE MESSAGE.
HIDE ALL NO-PAUSE IN WINDOW w1.

/* statements/if.txt: IF */
IF par_kontakt = '' THEN DO:
  UNDO, THROW NEW Progress.Lang.AppError("msg", 400).
END.
ELSE DO:
  ASSIGN par_kontakt = "x".
END.

IF NOT AVAIL(Debtor) THEN UNDO, THROW NEW Progress.Lang.AppError("missing", 400).

IF NOT CAN-FIND(FIRST Contact WHERE Contact.Address_ID = Address.Address_ID) THEN DO:
  DISPLAY Contact.ContactName.
END.

IF CAN-FIND(LAST Activity WHERE Activity.Activity_ID = 10) THEN DO:
  DISPLAY Activity.Activity_ID.
END.

IF CAN-FIND(FIRST LogTable WHERE LogTable.Log_ID = 10 USE-INDEX log_idx) THEN DO:
  DISPLAY LogTable.Log_ID.
END.
IF CAN-FIND(FIRST Contact WHERE) THEN DO:
  DISPLAY Contact.ContactName.
END.

IF hasFlag THEN DO:
  DISPLAY hasFlag.
END.
/* bridge */
ELSE IF otherFlag THEN DISPLAY otherFlag.

IF skip THEN .

IF AVAILABLE Customer THEN .
IF AVAIL (Customer) THEN .
IF LOCKED bufOrder THEN RETURN TRUE.

/* statements/if.txt: IF - Inline THEN/ELSE */
IF x > 10 THEN x = 10.
ELSE IF x > 20 THEN x = 20.
ELSE x = x.

IF x > 10 THEN x = 10.
ELSE DO:
  x = 20.
END.

/* statements/if.txt: IF - Reference snippet */
DEFINE VARIABLE ans AS LOGICAL NO-UNDO.
DEFINE STREAM due.
OUTPUT STREAM due TO ovrdue.lst.
DISPLAY STREAM due
  "Orders shipped but still unpaid as of" TODAY SKIP(2)
  WITH NO-BOX NO-LABELS CENTERED FRAME hdr PAGE-TOP.
FOR EACH Order WITH FRAME oinfo:
  FIND Customer OF Order NO-LOCK.
  DISPLAY Order.OrderNum Customer.Name Order.OrderDate Order.PromiseDate
    Order.ShipDate.
  IF Order.ShipDate = ? THEN DO:
    IF Order.PromiseDate = ? THEN DO:
      MESSAGE "Please update the promise date.".
      REPEAT WHILE promise-date = ?:
        UPDATE Order.PromiseDate WITH FRAME oinfo.
      END.
    END.
    ans = FALSE.
    MESSAGE "Has this order been shipped?" UPDATE ans.
    IF ans THEN
      REPEAT WHILE Order.ShipDate = ?:
        UPDATE Order.ShipDate WITH FRAME oinfo.
      END.
  END.
  ELSE DO:
    ans = TRUE.
    MESSAGE "Has this order been paid?" UPDATE ans.
    IF NOT ans THEN DO:
      DISPLAY STREAM due Order.OrderNum TO 14 Customer.Name AT 18
        Order.OrderDate AT 42 Order.ShipDate AT 54
        WITH NO-BOX DOWN FRAME unpaid.
    END.
  END.
END.
OUTPUT STREAM due CLOSE.

/* statements/if.txt: IF with PROC variable name */
IF x > 0 THEN proc = 1.
IF x > 0 THEN proc = 1.
IF x > 0 THEN procedu = 1.
IF x > 0 THEN procedure = 1.

/* statements/image.txt: IMAGE DEFINITION - FILE Basic */
DEFINE IMAGE imgLogo FILE "logo.png".
DEF IMAGE icon1 FILE "icon.ico".

/* statements/image.txt: IMAGE DEFINITION - FILE with IMAGE-SIZE */
DEFINE IMAGE imgSized FILE "image.jpg" IMAGE-SIZE 100 BY 50.
DEF IMAGE imgS2 FILE "pic.png" IMAGE-SIZE 50 BY 100.

/* statements/image.txt: IMAGE DEFINITION - FILE with IMAGE-SIZE-CHARS */
DEFINE IMAGE imgChars FILE "pic.bmp" IMAGE-SIZE-CHARS 20 BY 10.
DEF IMAGE imgChar FILE "logo.gif" IMAGE-SIZE-CHARS 15 BY 30.

/* statements/image.txt: IMAGE DEFINITION - FILE with IMAGE-SIZE-PIXELS */
DEFINE IMAGE imgPix FILE "img.png" IMAGE-SIZE-PIXELS 200 BY 100.
DEF IMAGE imgPx FILE "photo.jpg" IMAGE-SIZE-PIXELS 150 BY 75.

/* statements/image.txt: IMAGE DEFINITION - FILE with FROM X Y */
DEFINE IMAGE imgXY FILE "image.png" FROM X 10 Y 20.
DEF IMAGE imgXY2 FILE "icon.jpg" IMAGE-SIZE 50 BY 50 FROM X 5 Y 10.

/* statements/image.txt: IMAGE DEFINITION - FILE with FROM ROW COLUMN */
DEFINE IMAGE imgRC FILE "pic.png" FROM ROW 5 COLUMN 10.
DEF IMAGE imgRC2 FILE "logo.jpg" IMAGE-SIZE-PIXELS 100 BY 50 FROM ROW 2 COLUMN 5.

/* statements/image.txt: IMAGE DEFINITION - COMPLETE IMAGE PHRASE */
DEFINE IMAGE imgFull FILE "full.png" IMAGE-SIZE-PIXELS 200 BY 100 FROM X 10 Y 20.

/* statements/image.txt: IMAGE DEFINITION - LIKE Option */
DEFINE IMAGE imgLike LIKE imgLogo.
DEF IMAGE img2 LIKE icon1.

/* statements/image.txt: IMAGE DEFINITION - SIZE */
DEFINE IMAGE imgSize SIZE 10 BY 20.
DEF IMAGE imgSz SIZE 30 BY 40.

/* statements/image.txt: IMAGE DEFINITION - SIZE-CHARS */
DEFINE IMAGE imgChars SIZE-CHARS 15 BY 25.
DEF IMAGE imgSC2 SIZE-CHARS 20 BY 30.

/* statements/image.txt: IMAGE DEFINITION - SIZE-PIXELS */
DEFINE IMAGE imgPixels SIZE-PIXELS 150 BY 200.
DEF IMAGE imgPx SIZE-PIXELS 100 BY 100.

/* statements/image.txt: IMAGE DEFINITION - BGCOLOR */
DEFINE IMAGE imgBg FILE "img.png" BGCOLOR 10.
DEF IMAGE imgBg2 FILE "pic.jpg" IMAGE-SIZE 50 BY 50 BGCOLOR 15.

/* statements/image.txt: IMAGE DEFINITION - FGCOLOR */
DEFINE IMAGE imgFg FILE "img.png" FGCOLOR 5.
DEF IMAGE imgFg2 FILE "pic.jpg" IMAGE-SIZE 50 BY 50 FGCOLOR 10.

/* statements/image.txt: IMAGE DEFINITION - Both Colors */
DEFINE IMAGE imgColors FILE "img.png" BGCOLOR 1 FGCOLOR 2.
DEF IMAGE imgBoth SIZE 20 BY 30 BGCOLOR 5 FGCOLOR 10.

/* statements/image.txt: IMAGE DEFINITION - CONVERT-3D-COLORS */
DEFINE IMAGE imgConvert FILE "img.png" CONVERT-3D-COLORS.
DEF IMAGE imgConv FILE "pic.jpg" SIZE 20 BY 30 CONVERT-3D-COLORS.

/* statements/image.txt: IMAGE DEFINITION - TOOLTIP */
DEFINE IMAGE imgTooltip FILE "img.png" TOOLTIP text.
DEF IMAGE imgTT FILE "pic.jpg" TOOLTIP "Image tooltip".

/* statements/image.txt: IMAGE DEFINITION - STRETCH-TO-FIT */
DEFINE IMAGE imgStretch FILE "img.png" STRETCH-TO-FIT.
DEF IMAGE imgSt FILE "pic.jpg" SIZE 30 BY 40 STRETCH-TO-FIT.

/* statements/image.txt: IMAGE DEFINITION - STRETCH-TO-FIT with RETAIN-SHAPE */
DEFINE IMAGE imgRetain FILE "img.png" STRETCH-TO-FIT RETAIN-SHAPE.
DEF IMAGE imgRS FILE "pic.jpg" SIZE 20 BY 25 STRETCH-TO-FIT RETAIN-SHAPE.

/* statements/image.txt: IMAGE DEFINITION - TRANSPARENT */
DEFINE IMAGE imgTransparent FILE "img.png" TRANSPARENT.
DEF IMAGE imgTrans FILE "pic.jpg" SIZE 20 BY 30 TRANSPARENT.

/* statements/image.txt: IMAGE DEFINITION - PRIVATE Modifier */
DEFINE PRIVATE IMAGE privImg FILE "priv.png".
DEF PRIVATE IMAGE privFile FILE "private.jpg" SIZE 10 BY 20.

/* statements/image.txt: IMAGE DEFINITION - Complete Combinations */
DEFINE IMAGE imgComplete FILE "complete.png"
  IMAGE-SIZE-PIXELS 200 BY 100
  FROM X 10 Y 20
  BGCOLOR 5
  FGCOLOR 10
  CONVERT-3D-COLORS
  TOOLTIP "Complete test image"
  STRETCH-TO-FIT RETAIN-SHAPE
  TRANSPARENT.

/* statements/image.txt: IMAGE DEFINITION - Minimal Required */
DEFINE IMAGE i FILE "x.png".
DEF IMAGE i2 LIKE other.
DEF IMAGE i3 SIZE 10 BY 20.

/* statements/image.txt: IMAGE - Reference snippet */
DEFINE VARIABLE repeat_loop AS INTEGER NO-UNDO.
DEFINE VARIABLE animation_loop AS INTEGER NO-UNDO.
DEFINE VARIABLE lok AS LOGICAL NO-UNDO.
DEFINE BUTTON animate LABEL "Animate".
DEFINE IMAGE trashcan FILE "ANI01.BMP".
DISPLAY animate trashcan WITH FRAME y TITLE "** Animation Sample **".
ON CHOOSE OF animate IN FRAME y DO:
  DO repeat_loop = 1 TO 5:
    DO animation_loop = 1 TO 14:
      lok = trashcan:LOAD-IMAGE("ANI" + STRING(animation_loop,"99")) IN FRAME y.
    END.
  END.
END.
UPDATE animate WITH FRAME y.

/* statements/import.txt: IMPORT */
IMPORT STREAM sIn UNFORMATTED lineText.
IMPORT DELIMITER "," fieldA ^ fieldB NO-LOBS NO-ERROR.
IMPORT recBuf EXCEPT fieldX fieldY.
IMPORT STREAM-HANDLE hStream mPtrData.

/* statements/import.txt: IMPORT - Reference snippets */
INPUT FROM customer.d.
DISABLE TRIGGERS FOR LOAD OF Customer.
REPEAT:
  CREATE Customer.
  IMPORT Customer.
END.
INPUT CLOSE.

DEFINE VARIABLE cnum LIKE Customer.CustNum NO-UNDO.
DEFINE VARIABLE cname LIKE Customer.Name NO-UNDO.
DEFINE VARIABLE cmax LIKE Customer.CreditLimit NO-UNDO.
INPUT FROM custdump2.
FOR EACH Customer:
  IMPORT DELIMITER ";" cnum cname cmax.
  DISPLAY cnum cname cmax.
END.
INPUT CLOSE.

DEFINE VARIABLE text-string AS CHARACTER NO-UNDO FORMAT "x(76)".
INPUT FROM VALUE(SEARCH("hello")).
DO WHILE TRUE ON ENDKEY UNDO, LEAVE:
  IMPORT UNFORMATTED text-string.
  DISPLAY text-string WITH DOWN FRAME x.
  DOWN WITH FRAME x NO-LABELS.
END.
INPUT CLOSE.

DEFINE VARIABLE bb AS MEMPTR NO-UNDO.
ASSIGN FILE-INFO:FILE-NAME = "big.in" SET-SIZE(bb) = FILE-INFO:FILE-SIZE.
INPUT FROM "big.in" BINARY NO-CONVERT.
IMPORT bb.
INPUT CLOSE.

/* statements/input-clear.txt: INPUT CLEAR */
INPUT CLEAR.

/* statements/input-clear.txt: INPUT CLEAR - Reference snippet */
READKEY.
IF LASTKEY = KEYCODE("1") THEN RUN ordentry.
ELSE IF LASTKEY = KEYCODE("2") THEN RUN receive.
ELSE IF LASTKEY = KEYCODE("3") THEN QUIT.
ELSE DO:
  MESSAGE "Sorry, that is not a valid choice".
  INPUT CLEAR.
END.

/* statements/input-output.txt: INPUT-OUTPUT CLOSE */
INPUT-OUTPUT CLOSE.
INPUT-OUTPUT STREAM sIO CLOSE.
INPUT-OUTPUT STREAM-HANDLE hStream CLOSE.

/* statements/input-output.txt: INPUT-OUTPUT THROUGH */
INPUT-OUTPUT THROUGH "myprogram".
INPUT-OUTPUT THROUGH prog arg1 arg2.
INPUT-OUTPUT THROUGH VALUE(cProgram) NO-ECHO.
INPUT-OUTPUT STREAM sIO THROUGH "filter" UNBUFFERED.

/* statements/input-output.txt: INPUT-OUTPUT THROUGH - MAP and NO-CONVERT variants */
INPUT-OUTPUT STREAM-HANDLE hIO THROUGH VALUE(cmd) MAP "laserwriter/french" NO-CONVERT.
INPUT-OUTPUT THROUGH myprog VALUE(arg1) NO-MAP CONVERT TARGET "utf-8".

/* statements/input-output.txt: INPUT-OUTPUT THROUGH - ECHO option */
INPUT-OUTPUT THROUGH "filter" ECHO.

/* statements/input-output.txt: INPUT-OUTPUT - Reference snippets */
FOR EACH Item WHERE Item.ItemNum < 10:
  DISPLAY Item.ItemNum Item.Price LABEL "Price before recalculation".
END.
INPUT-OUTPUT THROUGH r-iothru UNBUFFERED.
FOR EACH Item WHERE Item.ItemNum < 10:
  EXPORT Item.Price.
  SET Item.Price.
END.
INPUT-OUTPUT CLOSE.
FOR EACH Item WHERE Item.ItemNum < 10 WITH COLUMN 40:
  DISPLAY Item.ItemNum Item.Price LABEL "Price after recalculation".
END.

INPUT-OUTPUT THROUGH VALUE(cProgram) NO-ECHO.
INPUT-OUTPUT STREAM sIO THROUGH "filter" UNBUFFERED NO-CONVERT.
INPUT-OUTPUT STREAM sIO THROUGH "filter" CONVERT SOURCE "ibm850" TARGET "utf-8".

/* statements/input-through.txt: INPUT THROUGH */
INPUT THROUGH "progname" arg1 VALUE(arg2) NO-ECHO NO-MAP UNBUFFERED CONVERT TARGET "utf-8" SOURCE "ibm850".
INPUT STREAM sIn THROUGH VALUE(cmd) ECHO.

/* statements/input-through.txt: INPUT THROUGH - MAP and NO-CONVERT variants */
INPUT STREAM-HANDLE hIn THROUGH VALUE(cmd) MAP "hp2/spanish" NO-CONVERT.
INPUT THROUGH myprog VALUE(arg1) Func() NO-MAP UNBUFFERED CONVERT SOURCE "ibm850".

/* statements/input-through.txt: INPUT THROUGH - Convert phrase variants */
INPUT THROUGH "progname" NO-CONVERT.
INPUT THROUGH VALUE(cmd) CONVERT TARGET "utf-8" SOURCE "ibm850".

/* statements/input-through.txt: INPUT THROUGH - Reference snippets */
DEFINE VARIABLE process-id AS CHARACTER NO-UNDO.
DEFINE VARIABLE dir-path AS CHARACTER NO-UNDO VIEW-AS EDITOR SIZE 60 BY 10.
INPUT THROUGH echo $$ $PATH NO-ECHO.
SET process-id dir-path WITH FRAME indata NO-BOX NO-LABELS.
DISPLAY process-id dir-path FORMAT "x(70)".
INPUT CLOSE.

DEFINE VARIABLE dir-name AS CHARACTER NO-UNDO FORMAT "x(64)".
DEFINE VARIABLE fn AS CHARACTER NO-UNDO FORMAT "x(32)".
FORM fn WITH DOWN FRAME dir-list.
INPUT THROUGH pwd NO-ECHO.
SET dir-name.
INPUT CLOSE.
fn:LABEL IN FRAME dir-list = dir-name.
INPUT THROUGH ls NO-ECHO.
REPEAT:
  SET fn WITH NO-BOX NO-LABELS FRAME indata.
  DISPLAY fn VIEW-AS TEXT WITH FRAME dir-list.
  DOWN WITH FRAME dir-list.
END.
INPUT CLOSE.

/* statements/input.txt: INPUT */
INPUT FROM VALUE(inPath).
INPUT FROM TERMINAL NO-CONVERT.
INPUT STREAM inStream FROM OS-DIR("dir") NO-ATTR-LIST LOB-DIR {&LOB} BINARY NO-ECHO MAP termcap UNBUFFERED CONVERT TARGET "utf-8" SOURCE "ibm850".
INPUT STREAM-HANDLE hStream CLOSE.

/* statements/input.txt: INPUT - Reference snippet */
INPUT FROM VALUE(SEARCH("r-in.dat")).
REPEAT:
  PROMPT-FOR Customer.CustNum Customer.CreditLimit.
  FIND Customer USING INPUT Customer.CustNum.
  ASSIGN Customer.CreditLimit.
END.
INPUT CLOSE.

INPUT FROM OS-DIR("c:\\mydir") NO-ATTR-LIST.
INPUT FROM VALUE("file.txt") NO-ECHO.
INPUT FROM TERMINAL.
INPUT FROM VALUE(cPath) CONVERT SOURCE "ibm850" TARGET "utf-8".

/* statements/input.txt: INPUT - NO-MAP and NO-CONVERT */
INPUT FROM "data.txt" NO-MAP NO-CONVERT.
INPUT STREAM sIn FROM VALUE(cPath) ECHO.

/* statements/input.txt: INPUT - MAP with string and CONVERT SOURCE */
INPUT FROM "data.txt" MAP "hp2/spanish" CONVERT SOURCE "ibm850".

/* statements/input.txt: INPUT FROM - opsys_file (unquoted path) */
INPUT FROM /tmp/data.txt.
INPUT FROM ./report.dat.

/* statements/insert.txt: INSERT */
INSERT Customer.
INSERT db.Customer.
INSERT Customer EXCEPT field1.
INSERT Customer EXCEPT field1 field2.
INSERT Customer USING alternate.
INSERT Customer EXCEPT field1 USING alternate.
INSERT Customer WITH FRAME f1.
INSERT Customer NO-ERROR.

/* statements/insert.txt: INSERT - Reference snippet */
INSERT Order WITH 1 COLUMN.
REPEAT:
  CREATE OrderLine.
  OrderLine.OrderNum = Order.OrderNum.
  UPDATE OrderLine.LineNum OrderLine.ItemNum OrderLine.Qty
    OrderLine.Price.
  FIND Item OF OrderLine.
END.
END.

INSERT Customer USING ROWID(1).
INSERT Customer USING RECID(2) NO-ERROR.

/* statements/interface.txt: INTERFACE - INHERITS with Temp-Table, Dataset, and Event Prototypes */
INTERFACE App.Data.IOrderSvc INHERITS App.Core.IBaseSvc, App.Core.ILogging:
  DEFINE TEMP-TABLE ttOrder NO-UNDO LIKE Order.
  DEFINE DATASET dsOrders FOR ttOrder.
  DEFINE PUBLIC EVENT OrderLoaded SIGNATURE VOID (INPUT orderNum AS INTEGER).
  METHOD PUBLIC VOID LoadOrder (INPUT orderNum AS INTEGER, OUTPUT DATASET dsOrders).
END INTERFACE.

/* statements/leave.txt: LEAVE */
LEAVE.
LEAVE outerLoop.

/* statements/leave.txt: LEAVE - Reference snippet */
DEFINE VARIABLE valid-choice AS CHARACTER NO-UNDO INITIAL "NPFQ".
DEFINE VARIABLE selection AS CHARACTER NO-UNDO FORMAT "x".
main-loop:
REPEAT:
label1:
REPEAT ON ENDKEY UNDO label1, RETURN:
  MESSAGE "(N)ext (P)rev (F)ind (Q)uit".
  UPDATE selection AUTO-RETURN.
  IF INDEX(valid-choice, selection) <> 0 THEN LEAVE label1.
  BELL.
END.
IF selection = "Q" THEN LEAVE main-loop.
END.

/* statements/load-picture.txt: LOAD-PICTURE */
LOAD-PICTURE.
LOAD-PICTURE "logo.bmp".
LOAD-PICTURE cImagePath.

/* statements/load-picture.txt: LOAD-PICTURE - Reference snippet */
DEFINE VARIABLE chPic AS COM-HANDLE NO-UNDO.
DEFINE VARIABLE chControl AS COM-HANDLE NO-UNDO.
chPic = LOAD-PICTURE("myPic.bmp").
chControl:Picture = chPic.

/* statements/load.txt: LOAD */
LOAD "myapp.r".
LOAD cFile.
LOAD "myapp.r" DIR "/usr/lib".
LOAD "myapp.r" APPLICATION "app1".
LOAD "myapp.r" NEW.
LOAD "myapp.r" BASE-KEY "INI".
LOAD "myapp.r" NO-ERROR.
LOAD "myapp.r" DIR "/usr/lib" APPLICATION "app1" NEW.

/* statements/load.txt: LOAD - VALUE expressions */
LOAD VALUE(cFile) DIR VALUE(cDir) APPLICATION VALUE(cApp) NEW BASE-KEY VALUE(cKey) NO-ERROR.

/* statements/load.txt: LOAD - Reference snippet */
LOAD "myenv".
LOAD "myenv" DIR "C:\\temp".
LOAD "myenv" NEW BASE-KEY "INI" NO-ERROR.
LOAD "myenv" BASE-KEY "HKEY_CURRENT_USER".

/* statements/menu.txt: MENU basic definition */
DEFINE MENU mnuMain MENUBAR
  MENU-ITEM miFile LABEL "File"
  MENU-ITEM miEdit LABEL "Edit".

/* statements/menu.txt: MENU with submenu */
DEFINE MENU mnuBar MENUBAR
  SUB-MENU smFile LABEL "File"
  RULE
  MENU-ITEM miExit LABEL "Exit".

/* statements/menu.txt: MENU popup with title */
DEFINE MENU mnuPopup TITLE "Context Menu"
  MENU-ITEM miCopy LABEL "Copy"
  SKIP
  MENU-ITEM miPaste LABEL "Paste".

/* statements/menu.txt: MENU shared definition */
DEFINE NEW SHARED MENU mnuShared MENUBAR.

/* statements/menu.txt: MENU with colors */
DEFINE MENU mnuColored
  FGCOLOR 15
  BGCOLOR 1
  MENU-ITEM mi1 LABEL "Item".

/* statements/menu.txt: MENU - LIKE option */
DEFINE MENU mnuLike LIKE mnuMain.

/* statements/menu.txt: MENU - TITLE only */
DEFINE MENU mnuTitle TITLE "My Menu"
  menu-item mi1 LABEL "Item 1".

/* statements/menu.txt: MENU - NEW SHARED only */
DEFINE NEW SHARED MENU mnuNS.

/* statements/menu.txt: MENU - SHARED only */
DEFINE SHARED MENU mnuShared2.

/* statements/menu.txt: MENU - PRIVATE only */
DEFINE PRIVATE MENU mnuPriv.

/* statements/menu.txt: MENU - DCOLOR only */
DEFINE MENU mnuDC DCOLOR 5
  MENU-ITEM mi1 LABEL "Item".

/* statements/menu.txt: MENU - PFCOLOR only */
DEFINE MENU mnuPF PFCOLOR 3
  MENU-ITEM mi1 LABEL "Item".

/* statements/menu.txt: MENU - FONT only */
DEFINE MENU mnuFont FONT 2
  MENU-ITEM mi1 LABEL "Item".

/* statements/menu.txt: MENU - All colors */
DEFINE MENU mnuAllColors
  FGCOLOR 10
  BGCOLOR 1
  DCOLOR 5
  PFCOLOR 3
  MENU-ITEM miTest LABEL "Test".

/* statements/menu.txt: MENU - MENU-ITEM without label */
DEFINE MENU mnuNoLab
  MENU-ITEM mi1
  MENU-ITEM mi2.

/* statements/menu.txt: MENU - MENU-ITEM with ACCELERATOR */
DEFINE MENU mnuAcc
  MENU-ITEM miSave LABEL "Save" ACCELERATOR "Ctrl+S"
  MENU-ITEM miOpen LABEL "Open" ACCELERATOR "Ctrl+O".

/* statements/menu.txt: MENU - SUB-MENU without label */
DEFINE MENU mnuSl
  SUB-MENU sm1
  SUB-MENU sm2 LABEL "Menu 2".

/* statements/menu.txt: MENU - SUB-MENU DISABLED */
DEFINE MENU mnuSMD
  SUB-MENU sm1 DISABLED
  SUB-MENU sm2 DISABLED LABEL "Disabled".

/* statements/menu.txt: MENU - MENU-ITEM DISABLED */
DEFINE MENU mnuMID
  MENU-ITEM mi1 DISABLED LABEL "Disabled Item"
  MENU-ITEM mi2 LABEL "Item 2" DISABLED.

/* statements/menu.txt: MENU - Multiple RULEs */
DEFINE MENU mnuMRules TITLE "Rules"
  RULE
  RULE
  MENU-ITEM mi1 LABEL "Item 1"
  RULE
  MENU-ITEM mi2 LABEL "Item 2".

/* statements/menu.txt: MENU - Minimal */
DEFINE MENU m.
DEF MENU mnu.

/* statements/menu.txt: MENU - Complete combination */
DEFINE MENU mnuComplete
  FGCOLOR 15
  BGCOLOR 1
  DCOLOR 5
  PFCOLOR 10
  FONT 2
  MENUBAR
  MENU-ITEM miFile LABEL "File" ACCELERATOR "Ctrl+F"
  MENU-ITEM miEdit LABEL "Edit" DISABLED
  RULE
  SUB-MENU smOptions LABEL "Options"
  RULE
  MENU-ITEM miExit LABEL "Exit".

/* statements/menu.txt: MENU - Reference snippet */
DEFINE SUB-MENU topic
  MENU-ITEM numbr LABEL "Cust. Number"
  MENU-ITEM addr LABEL "Address"
  MENU-ITEM othrinfo LABEL "Other".
DEFINE SUB-MENU move
  MENU-ITEM forward LABEL "NextRec" ACCELERATOR "PAGE-DOWN"
  MENU-ITEM backward LABEL "PrevRec" ACCELERATOR "PAGE-UP".
DEFINE SUB-MENU quitit
  MENU-ITEM quititem LABEL "E&xit".
DEFINE MENU mbar MENUBAR
  SUB-MENU topic LABEL "Topic"
  SUB-MENU move LABEL "Move"
  SUB-MENU quitit LABEL "E&xit".
ON CHOOSE OF MENU-ITEM numbr
  DISPLAY Customer.CustNum.
ON CHOOSE OF MENU-ITEM addr
  DISPLAY Customer.Address Customer.Address2 Customer.City
    Customer.State Customer.PostalCode
    WITH FRAME addr-frame NO-LABELS COLUMN 25.
ON CHOOSE OF MENU-ITEM othrinfo
  DISPLAY Customer EXCEPT Customer.Name Customer.CustNum Customer.Address
    Customer.Address2 Customer.City Customer.State Customer.PostalCode
    WITH FRAME oth-frame SIDE-LABELS.
ON CHOOSE OF MENU-ITEM forward DO:
  HIDE ALL NO-PAUSE.
  CLEAR FRAME name-frame.
  FIND NEXT Customer NO-ERROR.
  IF AVAILABLE Customer THEN
    DISPLAY Customer.Name WITH FRAME name-frame.
END.
ON CHOOSE OF MENU-ITEM backward DO:
  HIDE ALL NO-PAUSE.
  CLEAR FRAME name-frame.
  FIND PREV Customer NO-ERROR.
  IF AVAILABLE Customer THEN
    DISPLAY Customer.Name WITH FRAME name-frame.
END.
FIND FIRST Customer.
DISPLAY Customer.Name LABEL "Customer Name" WITH FRAME name-frame.
ASSIGN CURRENT-WINDOW:MENUBAR = MENU mbar:HANDLE.
WAIT-FOR CHOOSE OF MENU-ITEM quititem.

/* statements/message.txt: MESSAGE basic */
MESSAGE "Hello".
MESSAGE "Hello World!".
MESSAGE x.

/* statements/message.txt: MESSAGE with MENU keyword as value */
MESSAGE MENU.

/* statements/message.txt: MESSAGE with SKIP */
MESSAGE "Line 1" SKIP "Line 2".
MESSAGE "Hello" SKIP(2) "World".

/* statements/message.txt: MESSAGE VIEW-AS ALERT-BOX */
MESSAGE "Simple" SKIP VIEW-AS ALERT-BOX QUESTION.
MESSAGE "Info" VIEW-AS ALERT-BOX INFORMATION.
MESSAGE "Short" VIEW-AS ALERT-BOX INFO.
MESSAGE "Warn" VIEW-AS ALERT-BOX WARNING.
MESSAGE "Err" VIEW-AS ALERT-BOX ERROR.
MESSAGE "Msg" VIEW-AS ALERT-BOX MESSAGE.
MESSAGE "Done" VIEW-AS ALERT-BOX INFO BUTTONS OK.

/* statements/message.txt: MESSAGE with BUTTONS */
MESSAGE "Continue?" VIEW-AS ALERT-BOX BUTTONS YES-NO.
MESSAGE "Confirm" VIEW-AS ALERT-BOX BUTTONS YES-NO-CANCEL.
MESSAGE "Done" VIEW-AS ALERT-BOX BUTTONS OK.
MESSAGE "Proceed?" VIEW-AS ALERT-BOX BUTTONS OK-CANCEL.
MESSAGE "Retry?" VIEW-AS ALERT-BOX BUTTONS RETRY-CANCEL.

/* statements/message.txt: MESSAGE with TITLE */
MESSAGE "Content" VIEW-AS ALERT-BOX TITLE "My Title".
MESSAGE "Msg" VIEW-AS ALERT-BOX INFORMATION TITLE "Info".

/* statements/message.txt: MESSAGE with UPDATE */
MESSAGE "Alert" VIEW-AS ALERT-BOX BUTTONS OK-CANCEL UPDATE okFlag AS LOGICAL.
MESSAGE "Input" VIEW-AS ALERT-BOX UPDATE response AS CHARACTER.

/* statements/message.txt: MESSAGE with COLOR */
MESSAGE COLOR NORMAL "Export done: " + fileName.
MESSAGE COLOR INPUT "Enter value".
MESSAGE COLOR MESSAGES "Status message".
MESSAGE COLOR "FF" "Hex message".
MESSAGE COLOR RED "Color message".

/* statements/message.txt: MESSAGE with IN WINDOW */
MESSAGE "Hello" IN WINDOW hWin.
MESSAGE "World" VIEW-AS ALERT-BOX IN WINDOW hMainWindow.

/* statements/message.txt: MESSAGE complex example */
MESSAGE COLOR NORMAL "Export done: " + fileName SKIP(2) VIEW-AS ALERT-BOX INFORMATION BUTTONS OK-CANCEL TITLE "Alert" UPDATE okFlag AS LOGICAL AUTO-RETURN IN WINDOW hWin.

/* statements/message.txt: MESSAGE with expressions */
MESSAGE "Total: " + STRING(amount).
MESSAGE "Count: " numRecords.
MESSAGE Customer.Name " - " Customer.Balance.

/* statements/message.txt: MESSAGE with SET clause */
MESSAGE "Enter name:" SET cName AS CHARACTER.
MESSAGE "Value?" SET iValue AS INTEGER FORMAT ">>9".

/* statements/message.txt: MESSAGE with LIKE clause */
MESSAGE "Enter customer:" UPDATE cNum LIKE Customer.CustNum.

/* statements/message.txt: MESSAGE - Reference snippets */
REPEAT:
  PROMPT-FOR Customer.CustNum.
  FIND Customer USING Customer.CustNum NO-ERROR.
  IF NOT AVAILABLE Customer THEN DO:
    MESSAGE "Customer with CustNum " INPUT Customer.CustNum
      " does not exist. Please try another".
    UNDO, RETRY.
  END.
  ELSE
    DISPLAY Customer.Name Customer.SalesRep.
END.

DEFINE VARIABLE cust-list AS CHARACTER NO-UNDO
  VIEW-AS SELECTION-LIST SINGLE SIZE 50 BY 10 LABEL "Customers".
DEFINE VARIABLE ok-status AS LOGICAL NO-UNDO.
FORM cust-list WITH FRAME sel-frame.
ON DEFAULT-ACTION OF cust-list DO:
  MESSAGE "You have chosen to delete" cust-list:SCREEN-VALUE + "." SKIP(1)
    "Do you really want to delete this customer?"
    VIEW-AS ALERT-BOX QUESTION BUTTONS YES-NO-CANCEL
    TITLE "" UPDATE lChoice AS LOGICAL.
  CASE lChoice:
    WHEN TRUE THEN DO:
      FIND Customer WHERE Customer.Name = cust-list:SCREEN-VALUE EXCLUSIVE-LOCK.
      DELETE Customer.
    END.
    WHEN FALSE THEN DO:
      MESSAGE "Deletion canceled." VIEW-AS ALERT-BOX INFORMATION BUTTONS OK.
      RETURN NO-APPLY.
    END.
    OTHERWISE STOP.
  END CASE.
END.

/* statements/message.txt: MESSAGE SET/UPDATE - VIEW-AS phrase */
MESSAGE "Select" VIEW-AS ALERT-BOX SET flag VIEW-AS TOGGLE-BOX.

/* statements/next-prompt.txt: NEXT-PROMPT */
NEXT-PROMPT field1.
NEXT-PROMPT Name.
NEXT-PROMPT field1 WITH FRAME f1.

/* statements/next-prompt.txt: NEXT-PROMPT with qualified field names */
NEXT-PROMPT Customer.Name.
NEXT-PROMPT Order.OrderNum.

/* statements/next-prompt.txt: NEXT-PROMPT with different expressions */
NEXT-PROMPT cField.
NEXT-PROMPT fieldName.
NEXT-PROMPT field1 WITH FRAME frame1.

/* statements/next-prompt.txt: NEXT-PROMPT with WITH FRAME variations */
NEXT-PROMPT field1 WITH FRAME main.
NEXT-PROMPT field2 WITH FRAME detail.

/* statements/next-prompt.txt: NEXT-PROMPT - Reference snippet */
FOR EACH Customer:
  UPDATE Customer WITH 2 COLUMNS.
  IF Customer.Contact EQ " " THEN DO:
    MESSAGE "You must enter a contact".
    NEXT-PROMPT Customer.Contact.
    UNDO, RETRY.
  END.
END.

DEFINE VARIABLE a AS CHARACTER NO-UNDO.
DEFINE VARIABLE b AS CHARACTER NO-UNDO.
NEXT-PROMPT b.
UPDATE a b.

/* statements/next.txt: NEXT */
NEXT.
NEXT outer_loop.

/* statements/next.txt: NEXT - Reference snippet */
PROMPT-FOR Customer.SalesRep LABEL "Enter salesman initials"
  WITH SIDE-LABELS CENTERED.
FOR EACH Customer:
  IF Customer.SalesRep <> INPUT Customer.SalesRep THEN NEXT.
  DISPLAY Customer.CustNum Customer.Name Customer.City Customer.State
    WITH CENTERED USE-TEXT.
END.

/* statements/object-constructors.txt: OBJECT CONSTRUCTORS */
obj = NEW MyClass() NO-ERROR.
obj = DYNAMIC-NEW "MyClass" () NO-ERROR.
THIS-OBJECT().
SUPER().

/* statements/on.txt: ON */
ON WRITE OF Customer NEW new-cust OLD old-cust DO:
  a += 3.
END.

ON ASSIGN OF Customer.Name OLD VALUE old-name REVERT.
ON FIND OF Customer OVERRIDE REVERT.
ON "WRITE" OF Customer REVERT.
ON CHOOSE ANYWHERE DO:
  MESSAGE "x".
END.
ON CHOOSE OF btn PERSISTENT RUN onChoose (INPUT 1).
ON RETURN OF BROWSE br1 DO:
  MESSAGE "browse-return".
END.

/* statements/on.txt: ON - Reference snippets */
ON WRITE OF Customer NEW new-cust OLD old-cust DO:
  IF new-cust.City <> old-cust.City AND
     new-cust.PostalCode = old-cust.PostalCode THEN DO:
    MESSAGE "Must update postal code, too.".
    RETURN ERROR.
  END.
END.
FOR EACH Customer:
  UPDATE Customer.
END.

DEFINE BUTTON b_next LABEL "Next".
DEFINE BUTTON b_prev LABEL "Previous".
DEFINE BUTTON b_quit LABEL "Quit".
DEFINE FRAME butt-frame b_next b_prev WITH CENTERED ROW SCREEN-LINES - 1.
DEFINE FRAME info
  Customer.CustNum Customer.Name
  b_quit AT ROW-OF Customer.CustNum + 2 COLUMN-OF Customer.CustNum + 18
  WITH CENTERED TITLE "Customers" ROW 2 1 COL.
ON CHOOSE OF b_next, b_prev DO:
  IF SELF:LABEL = "Next" THEN
    FIND NEXT Customer NO-LOCK.
  ELSE
    FIND PREV Customer NO-LOCK.
  DISPLAY Customer.CustNum Customer.Name WITH FRAME info.
END.
ENABLE b_next b_prev WITH FRAME butt-frame.
ENABLE b_quit WITH FRAME info.
WAIT-FOR END-ERROR OF FRAME butt-frame OR
  CHOOSE OF b_quit IN FRAME info FOCUS b_next IN FRAME butt-frame.

ON F1 GO.
ON F2 HELP.
ON CTRL-X BELL.
ON F5 ENDKEY.

/* statements/on.txt: ON - OR event/widget clauses */
ON 'z' OF kodkk OR 'Z' OF kodkk DO:
END.

ON LEAVE OF FIELD lvd_tara IN FRAME wr OR LEAVE OF FIELD lvd_brutto IN FRAME wr DO:
END.

ON LEAVE OF FIELD arr[1] IN FRAME wr DO:
END.

/* statements/on.txt: ON - Branch: UI ANYWHERE + REVERT */
ON CHOOSE ANYWHERE REVERT.

/* statements/on.txt: ON - Branch: UI OF + ANYWHERE + REVERT */
ON CHOOSE OF btn1 ANYWHERE REVERT.

/* statements/on.txt: ON - Branch: UI OF widget-list with MENU-ITEM entries */
ON CHOOSE OF MENU-ITEM mi1, MENU-ITEM mi2 DO:
END.

/* statements/on.txt: ON - Branch: UI OF/OR + ANYWHERE + PERSISTENT RUN */
ON CHOOSE OF btn1 OR LEAVE OF btn2 ANYWHERE PERSISTENT RUN hProc (INPUT 1).

/* statements/on.txt: ON - Branch: database event with REVERT */
ON WRITE OF Customer REVERT.

/* statements/on.txt: ON - Branch: database event with referencing phrase + block */
ON ASSIGN OF Customer.Name OLD VALUE oldVal DO:
END.

/* statements/on.txt: ON - Branch: WEB-NOTIFY */
ON "WEB-NOTIFY" ANYWHERE DO:
END.

/* statements/on.txt: ON - Branch: key-label + key-function */
ON F10 HELP.

/* statements/on.txt: ON - Branch: OF + key-function action */
ON "X" OF btn GO.

/* statements/on.txt: ON - Branch: UI-event key-label + key-function */
ON TAB TAB.
ON TAB ENDKEY.

/* statements/open-query.txt: OPEN QUERY statement */
OPEN QUERY qCust FOR EACH Customer NO-LOCK.
OPEN QUERY qCust FOR EACH Customer NO-LOCK BY Customer.Name.

/* statements/open-query.txt: OPEN QUERY with DESC short form */
OPEN QUERY q1 FOR EACH zr BY zr_procent DESC BY zr_wyd DESC.

/* statements/open-query.txt: OPEN QUERY with lock before USE-INDEX */
OPEN QUERY q1 FOR EACH tr_hist WHERE tr_type = "RCT-TR" NO-LOCK USE-INDEX tr_nbr_eff BY tr_trnbr DESC.
OPEN QUERY q1 FOR EACH tr_hist NO-LOCK WHERE tr_type = "RCT-TR" BY tr_trnbr.

/* statements/open-query.txt: OPEN QUERY - Reference snippet */
DEFINE QUERY q-order FOR Customer, Order, OrderLine, Item.
OPEN QUERY q-order FOR EACH Customer,
  EACH Order OF Customer,
  EACH OrderLine OF Order,
  EACH Item OF OrderLine NO-LOCK.
GET FIRST q-order.
DO WHILE AVAILABLE Customer:
  DISPLAY Customer.CustNum Customer.Name SKIP
    Customer.Phone SKIP
    Order.OrderNum Order.OrderDate SKIP
    OrderLine.LineNum OrderLine.Price OrderLine.Qty SKIP
    Item.ItemNum Item.ItemName SKIP
    Item.CatDesc VIEW-AS EDITOR SIZE 50 BY 2 SCROLLBAR-VERTICAL
    WITH FRAME ord-info CENTERED SIDE-LABELS TITLE "Order Information".
  ASSIGN Item.CatDesc:READ-ONLY IN FRAME ord-info = TRUE
    Item.CatDesc:SENSITIVE IN FRAME ord-info = TRUE.
  PAUSE.
  GET NEXT q-order.
END.

OPEN QUERY qCust FOR EACH Customer BREAK BY Customer.State NO-LOCK.
OPEN QUERY qCust FOR EACH Customer NO-LOCK INDEXED-REPOSITION MAX-ROWS 10.
OPEN QUERY qCust PRESELECT EACH Customer NO-LOCK.
OPEN QUERY qCust FOR EACH Customer BY COLLATE(Customer.Name, "CASE-INSENSITIVE") DESCENDING.
OPEN QUERY qCust FOR EACH Customer WHERE Customer.CustNum > 0 USE-INDEX CustNum SHARE-LOCK.
OPEN QUERY qCust FOR EACH Customer EXCLUSIVE-LOCK.
OPEN QUERY qCust FOR EACH Customer, FIRST Order OF Customer NO-LOCK.
OPEN QUERY qCust FOR EACH Customer QUERY-TUNING(LOOKAHEAD CACHE-SIZE 5 SEPARATE-CONNECTION NO-SEPARATE-CONNECTION DEBUG SQL NO-DEBUG NO-JOIN-BY-SQLDB NO-LOOKAHEAD NO-INDEX-HINT).
OPEN QUERY qCust FOR EACH Customer QUERY-TUNING(JOIN-BY-SQLDB NO-BIND-WHERE) NO-LOCK INDEXED-REPOSITION MAX-ROWS 100.

/* statements/os-append.txt: OS-APPEND statement */
OS-APPEND "source.txt" "target.txt".
OS-APPEND cSource cTarget.

/* statements/os-append.txt: OS-APPEND - Reference snippet */
DEFINE VARIABLE sourcefile AS CHARACTER NO-UNDO.
DEFINE VARIABLE targetfile AS CHARACTER NO-UNDO FORMAT "x(20)" VIEW-AS FILL-IN.
DEFINE VARIABLE OKpressed AS LOGICAL NO-UNDO INITIAL TRUE.
Main:
REPEAT:
  SYSTEM-DIALOG GET-FILE sourcefile
    TITLE "Choose Source File For Append"
    MUST-EXIST
    USE-FILENAME
    UPDATE OKpressed.
  IF OKpressed = FALSE THEN
    LEAVE Main.
  UPDATE targetfile WITH FRAME appendframe.
  OS-APPEND VALUE(sourcefile) VALUE(targetfile).
END.

/* statements/os-command.txt: OS-COMMAND */
OS-COMMAND VALUE("echo ok").
OS-COMMAND NO-WAIT dir /b.
OS-COMMAND SILENT VALUE(cmd).

/* statements/os-command.txt: OS-COMMAND - reference snippets and options */
DEFINE VARIABLE comm-line AS CHARACTER NO-UNDO FORMAT "x(70)".
REPEAT:
UPDATE comm-line.
OS-COMMAND VALUE(comm-line).
END.

OS-COMMAND NO-CONSOLE VALUE("dir").
OS-COMMAND VALUE("echo") "ok".

/* statements/os-command.txt: OS-COMMAND - extra command tokens */
OS-COMMAND NO-WAIT VALUE("echo") "done" 1 /q.
OS-COMMAND SILENT "ping" "localhost" /n 1.

/* statements/os-copy.txt: OS-COPY statement */
OS-COPY "source.txt" "target.txt".
OS-COPY cSource cTarget.

/* statements/os-copy.txt: OS-COPY - reference snippets and VALUE */
DEFINE VARIABLE sourcefilename AS CHARACTER NO-UNDO.
DEFINE VARIABLE copyfilename AS CHARACTER NO-UNDO FORMAT "x(20)" VIEW-AS FILL-IN.
DEFINE VARIABLE OKpressed AS LOGICAL NO-UNDO INITIAL TRUE.
Main:
REPEAT:
SYSTEM-DIALOG GET-FILE sourcefilename
TITLE "Choose File to Copy"
MUST-EXIST
USE-FILENAME
UPDATE OKpressed.
IF OKpressed = FALSE THEN
LEAVE Main.
UPDATE copyfilename WITH FRAME copyframe.
OS-COPY VALUE(sourcefilename) VALUE(copyfilename).
END.

OS-COPY VALUE("a.txt") "b.txt".
OS-COPY "a.txt" VALUE("b.txt").

/* statements/os-create-dir.txt: OS-CREATE-DIR statement */
OS-CREATE-DIR "mydir".
OS-CREATE-DIR cDirName.

/* statements/os-create-dir.txt: OS-CREATE-DIR - reference snippets and VALUE */
DEFINE VARIABLE stat AS INTEGER NO-UNDO.
DEFINE VARIABLE dir_name AS CHARACTER NO-UNDO FORMAT "x(64)"
LABEL "Enter the name of the directory you want to create.".
UPDATE dir_name.
OS-CREATE-DIR VALUE(dir_name).
stat = OS-ERROR.
IF stat NE 0 THEN
MESSAGE "Directory not created. System Error #" stat.

OS-CREATE-DIR VALUE("tmp") "logs".

/* statements/os-delete.txt: OS-DELETE */
OS-DELETE VALUE(filePath).
OS-DELETE tmpFile tmpDir RECURSIVE.

/* statements/os-delete.txt: OS-DELETE - reference snippets and RECURSIVE */
DEFINE VARIABLE filename AS CHARACTER NO-UNDO.
DEFINE VARIABLE OKpressed AS LOGICAL NO-UNDO INITIAL TRUE.
Main:
REPEAT:
SYSTEM-DIALOG GET-FILE filename
TITLE "Choose File to Delete"
MUST-EXIST
USE-FILENAME
UPDATE OKpressed.
IF OKpressed = FALSE THEN LEAVE Main.
ELSE OS-DELETE VALUE(filename).
END.

OS-DELETE VALUE("tmp") RECURSIVE.

/* statements/os-delete.txt: OS-DELETE - multiple targets with RECURSIVE */
OS-DELETE VALUE(cPath) "tmp" RECURSIVE.

/* statements/os-rename.txt: OS-RENAME statement */
OS-RENAME "old.txt" "new.txt".
OS-RENAME cOld cNew.

/* statements/os-rename.txt: OS-RENAME - reference snippets and VALUE */
DEFINE VARIABLE sourcefile AS CHARACTER NO-UNDO.
DEFINE VARIABLE targetfile AS CHARACTER NO-UNDO FORMAT "x(20)" VIEW-AS FILL-IN.
DEFINE VARIABLE OKpressed AS LOGICAL NO-UNDO INITIAL TRUE.
Main:
REPEAT:
SYSTEM-DIALOG GET-FILE sourcefile
TITLE "Choose a File or Directory to Rename"
MUST-EXIST
USE-FILENAME
UPDATE OKpressed.
IF OKpressed = FALSE THEN
LEAVE Main.
UPDATE targetfile WITH FRAME newnameframe.
OS-RENAME VALUE(sourcefile) VALUE(targetfile).
END.

OS-RENAME VALUE("a.txt") "b.txt".
OS-RENAME "a.txt" VALUE("b.txt").

/* statements/output.txt: OUTPUT */
OUTPUT CLOSE.
OUTPUT STREAM outStream CLOSE.
OUTPUT STREAM-HANDLE hOut CLOSE.
OUTPUT TO VALUE(outPath + "/data.xml") APPEND.
OUTPUT TO PRINTER "HP" NUM-COPIES 2 LANDSCAPE PAGED PAGE-SIZE 60 NO-ECHO NO-MAP UNBUFFERED NO-CONVERT.
OUTPUT THROUGH "crypt" mypass NO-ECHO.
OUTPUT TO "file.log".
OUTPUT TO VALUE(path) CONVERT SOURCE "UTF-8" TARGET "1250".
OUTPUT TO "out.txt" CONVERT TARGET "1250".
OUTPUT TO PRINTER pName PORTRAIT.
OUTPUT TO TERMINAL NO-ECHO PAGED PAGE-SIZE 24.

/* statements/output.txt: OUTPUT THROUGH - MAP and NO-CONVERT variants */
OUTPUT THROUGH VALUE(cmd) MAP "hp2/spanish" NO-CONVERT.
OUTPUT THROUGH myprog NO-MAP CONVERT TARGET "utf-8".

/* statements/output.txt: OUTPUT TO VALUE with preprocessor name option */
OUTPUT TO VALUE({&OUT}) {&OUTPUT-ARGS}.

/* statements/output.txt: OUTPUT - reference snippets and options */
OUTPUT TO cust.dat.
FOR EACH Customer NO-LOCK:
DISPLAY Customer.CustNum Customer.Name Customer.Address Customer.Address2
Customer.City Customer.State Customer.Country SKIP(2)
WITH 1 COLUMN SIDE-LABELS.
END.
OUTPUT CLOSE.
DISPLAY "Finished".

DEFINE VARIABLE ix AS INTEGER NO-UNDO.
OUTPUT TO TERMINAL PAGED.
FOR EACH Customer NO-LOCK BREAK BY Customer.SalesRep:
FIND SalesRep OF Customer NO-LOCK.
FORM HEADER TODAY
"Customer Listing For " TO 43
"Page " TO 55 PAGE-NUMBER - ix TO 58 FORMAT "99"
(SalesRep.RepName) FORMAT "x(30)" AT 25
WITH FRAME hdr PAGE-TOP CENTERED.
VIEW FRAME hdr.
DISPLAY Customer.CustNum COLUMN-LABEL "Customer!Number"
Customer.Name LABEL "Name"
Customer.Phone COLUMN-LABEL "Phone!Number" WITH CENTERED.
IF LAST-OF(Customer.SalesRep) THEN DO:
ix = PAGE-NUMBER.
PAGE.
END.
END.
OUTPUT CLOSE.

OUTPUT TO PRINTER NUM-COPIES 3.
OUTPUT TO PRINTER LANDSCAPE NUM-COPIES 3.
OUTPUT TO PRINTER PORTRAIT NUM-COPIES VALUE(copies) COLLATE.
OUTPUT TO PRINTER "\\fs_dev\hplas4" PAGE-SIZE VALUE(pageLines).
OUTPUT TO "out.txt" LOB-DIR VALUE(lobDir) APPEND.
OUTPUT TO "out.bin" BINARY NO-CONVERT.
OUTPUT TO "out.txt" ECHO KEEP-MESSAGES.
OUTPUT TO "out.txt" NO-ECHO MAP laserwriter/french.
OUTPUT TO "out.txt" PAGED PAGE-SIZE 0.
OUTPUT STREAM s1 TO "out2.txt" UNBUFFERED.
OUTPUT STREAM s2 TO "CLIPBOARD".
OUTPUT STREAM-HANDLE hOut TO VALUE(dest) NO-MAP.
OUTPUT TO TERMINAL.

/* statements/output.txt: OUTPUT TO - opsys_file (unquoted path) */
OUTPUT TO /tmp/output.txt.
OUTPUT TO ../logs/app.log.

/* statements/overlay.txt: OVERLAY */
OVERLAY(cTarget, 1) = "X".
OVERLAY(cString, 5, 3) = "ABC".
OVERLAY(cData, 1, 10, CHARACTER) = cValue.
OVERLAY(mBuffer, 5, 4, RAW) = mSource.
OVERLAY(cLine, iPos, iLen, COLUMN) = "Hello".

/* statements/overlay.txt: OVERLAY - reference snippets and variants */
DEFINE VARIABLE chktext AS CHARACTER NO-UNDO.
DEFINE VARIABLE ix AS INTEGER NO-UNDO.
DEFINE VARIABLE chkndx AS INTEGER NO-UNDO.
DEFINE VARIABLE ndx AS INTEGER NO-UNDO.
DEFINE VARIABLE old-text AS CHARACTER NO-UNDO.
DEFINE VARIABLE new-text AS CHARACTER NO-UNDO.
DEFINE VARIABLE max-len AS INTEGER NO-UNDO.
DEFINE VARIABLE comment AS CHARACTER NO-UNDO FORMAT "x(49)" EXTENT 5
INITIAL ["You are probably interested in OpenEdge because",
"you have a lot of information to organize. You",
"want to get at the information, add to it, and",
"change it, without a lot of work and aggravation.",
"You made the right choice with OpenEdge." ].
DISPLAY comment WITH CENTERED FRAME comm NO-LABELS
TITLE "Why You Chose OpenEdge" ROW 4.
REPEAT:
SET old-text LABEL "Enter text to search for"
new-text LABEL "Enter text to replace with"
WITH FRAME replace SIDE-LABELS CENTERED.
max-len = MAXIMUM(LENGTH(old-text), LENGTH(new-text)).
DO ix = 1 TO 5:
ndx = 1.
DO ndx = 1 TO LENGTH(comment[ix]):
chktext = SUBSTRING(comment[ix], ndx).
chkndx = INDEX(chktext, old-text).
IF chkndx <> 0 THEN DO:
ndx = ndx + chkndx - 1.
OVERLAY(comment[ix], ndx, max-len, "CHARACTER") = new-text.
ndx = max-len.
END.
END.
DISPLAY comment[ix] WITH FRAME comm.
END.
END.

OVERLAY(cLine, 3, -1, "RAW") = cNew.
OVERLAY(cLong, 1, 5, "COLUMN") = "Hi".

/* statements/page.txt: PAGE statement */
PAGE.
PAGE STREAM sOut.

/* statements/page.txt: PAGE statement with STREAM-HANDLE */
PAGE STREAM-HANDLE hStream.

/* statements/page.txt: PAGE - reference snippet */
DEFINE VARIABLE laststate AS CHARACTER NO-UNDO.
OUTPUT TO PRINTER.
FOR EACH Customer NO-LOCK BY Customer.State:
IF Customer.State <> laststate THEN DO:
IF laststate <> "" THEN PAGE.
laststate = Customer.State.
END.
DISPLAY Customer.CustNum Customer.Name Customer.Address Customer.City Customer.State.
END.

/* statements/parameter.txt: PARAMETER DEFINITION - Direction Modifiers */
DEFINE INPUT PARAMETER p1 AS CHARACTER.
DEFINE OUTPUT PARAMETER p2 AS INTEGER.
DEFINE INPUT-OUTPUT PARAMETER p3 AS DECIMAL.
DEFINE RETURN PARAMETER pResult AS LOGICAL.
DEF RETURN PARAMETER retval AS INTEGER NO-UNDO.

/* statements/parameter.txt: PARAMETER DEFINITION - AS Type Phrase with CLASS */
DEFINE INPUT PARAMETER pCust AS CLASS Customer.
DEFINE OUTPUT PARAMETER pHnd AS HANDLE.
DEFINE INPUT-OUTPUT PARAMETER pObj AS CLASS Some.Type.

/* statements/parameter.txt: PARAMETER DEFINITION - LIKE Phrase */
DEFINE INPUT PARAMETER pName LIKE Customer.Name.
DEFINE OUTPUT PARAMETER pCode LIKE Customer.CustNum.
DEFINE INPUT-OUTPUT PARAMETER pField LIKE SalesOrderDetail.LineNum.

/* statements/parameter.txt: PARAMETER DEFINITION - EXTENT Phrase */
DEFINE INPUT PARAMETER pArray AS CHARACTER EXTENT.
DEFINE INPUT PARAMETER pArray10 AS INTEGER EXTENT 10.
DEFINE OUTPUT PARAMETER pArraySize AS DECIMAL EXTENT {&MAX_SIZE}.
DEFINE INPUT-OUTPUT PARAMETER pIds AS INTEGER EXTENT ?.

/* statements/parameter.txt: PARAMETER DEFINITION - INITIAL Option */
DEFINE INPUT PARAMETER pName AS CHARACTER INITIAL "Test".
DEFINE INPUT PARAMETER pNum AS INTEGER INITIAL 100.
DEFINE OUTPUT PARAMETER pArray AS INTEGER EXTENT 3 INITIAL [1, 2, 3].
DEFINE INPUT-OUTPUT PARAMETER pVals AS DECIMAL INITIAL [] NO-UNDO.
DEF INPUT PARAMETER pNull AS CHARACTER INITIAL ?.

/* statements/parameter.txt: PARAMETER DEFINITION - LABEL Option */
DEFINE INPUT PARAMETER pLabel AS CHARACTER LABEL "Parameter Label".
DEFINE OUTPUT PARAMETER pMulti AS INTEGER LABEL "First", "Second", "Third".

/* statements/parameter.txt: PARAMETER DEFINITION - FORMAT Option */
DEFINE INPUT PARAMETER pCode AS CHARACTER FORMAT "x(10)".
DEFINE OUTPUT PARAMETER pNum AS DECIMAL FORMAT "z,zzz.99".

/* statements/parameter.txt: PARAMETER DEFINITION - NO-UNDO Option */
DEFINE INPUT PARAMETER pVal AS INTEGER NO-UNDO.
DEFINE INPUT-OUTPUT PARAMETERpData AS CHARACTER NO-UNDO.

/* statements/parameter.txt: PARAMETER DEFINITION - BY-VALUE Option */
DEFINE INPUT PARAMETER TABLE-HANDLE hTable BY-VALUE.
DEFINE INPUT-OUTPUT PARAMETER DATASET-HANDLE hData BY-VALUE NO-UNDO.

/* statements/parameter.txt: PARAMETER DEFINITION - BY-REFERENCE Option */
DEFINE INPUT PARAMETER TABLE-HANDLE hTable BY-REFERENCE.
DEFINE INPUT-OUTPUT PARAMETER DATASET-HANDLE hData BY-REFERENCE BIND.

/* statements/parameter.txt: PARAMETER DEFINITION - APPEND Option */
DEFINE INPUT PARAMETER TABLE FOR ttOrders APPEND.
DEFINE OUTPUT PARAMETER DATASET FOR dsAudit APPEND BIND.

/* statements/parameter.txt: PARAMETER DEFINITION - BIND Option */
DEFINE INPUT-OUTPUT PARAMETER TABLE-HANDLE hTable BIND.
DEFINE OUTPUT PARAMETER DATASET-HANDLE hData BIND NO-UNDO.

/* statements/parameter.txt: PARAMETER DEFINITION - TABLE and DATASET Parameters */
DEFINE INPUT PARAMETER TABLE FOR ttCustomer.
DEFINE OUTPUT PARAMETER TABLE FOR ttOrder NO-UNDO.
DEFINE INPUT-OUTPUT PARAMETER TABLE FOR ttLine NO-UNDO.
DEFINE INPUT PARAMETER DATASET FOR dsInventory.
DEFINE OUTPUT PARAMETER DATASET-HANDLE hDataset.

/* statements/parameter.txt: PARAMETER DEFINITION - BUFFER Parameters */
DEFINE PARAMETER BUFFER pCust FOR Customer.
DEFINE PARAMETER BUFFER pTemp FOR TEMP-TABLE ttOrder PRESELECT.
DEFINE PARAMETER BUFFER bufCustomer FOR Customer PRESELECT.
DEFINE PARAMETER BUFFER bufTemp FOR TEMP-TABLE ttData PRESELECT.

/* statements/parameter.txt: PARAMETER DEFINITION - Combinations */
DEFINE INPUT PARAMETER pCombo AS INTEGER FORMAT ">>>>9" INITIAL 0 LABEL "Count" NO-UNDO.
DEFINE OUTPUT PARAMETER pArr AS INTEGER EXTENT 10 INITIAL [1,2,3] LABEL "Array" FORMAT "zz9".
DEF INPUT-OUTPUT PARAMETER pStr LIKE Customer.Name INITIAL "" NO-UNDO.
DEFINE INPUT PARAMETER pClass AS CLASS Customer NO-UNDO.
DEFINE RETURN PARAMETER pRes AS LOGICAL NO-UNDO.

/* statements/parameter.txt: PARAMETER DEFINITION - reference snippets and missing options */
RUN r-param.p (INPUT 10).

DEFINE INPUT PARAMETER int-param AS INTEGER NO-UNDO.
DISPLAY int-param LABEL "Integer input param"
WITH SIDE-LABELS.

DEFINE VARIABLE new-param AS CHARACTER NO-UNDO FORMAT "x(20)".
DEFINE VARIABLE out-param AS DECIMAL NO-UNDO.
DEFINE VARIABLE in-param AS INTEGER NO-UNDO INITIAL 20.
RUN r-param1.p (OUTPUT out-param, 10, OUTPUT new-param, in-param).
DISPLAY out-param LABEL "Updated YTD Sales" SKIP new-param LABEL "Status"
WITH SIDE-LABELS.

DEFINE OUTPUT PARAMETER xout-param AS DECIMAL NO-UNDO.
DEFINE INPUT PARAMETER newin AS INTEGER NO-UNDO.
DEFINE OUTPUT PARAMETER xnew-param AS CHARACTER NO-UNDO.
DEFINE INPUT PARAMETER xin-param AS INTEGER NO-UNDO.
FOR EACH Customer NO-LOCK:
xout-param = xout-param + Customer.Balance.
END.
DISPLAY xout-param LABEL "Balance" WITH SIDE-LABELS.
ASSIGN
xout-param = xout-param + newin + xin-param
xnew-param = "Example Complete".

DEFINE VARIABLE io-param AS INTEGER NO-UNDO.
FOR EACH Item:
DISPLAY Item.ItemName Item.OnHand WITH 1 DOWN.
io-param = Item.OnHand.
RUN r-param2.p (INPUT-OUTPUT io-param).
Item.OnHand = io-param.
DISPLAY io-param LABEL "New Quantity On-hand".
END.

DEFINE INPUT-OUTPUT PARAMETER io-param AS INTEGER NO-UNDO.
DEFINE VARIABLE inp-qty AS INTEGER NO-UNDO.
PROMPT-FOR inp-qty LABEL "Quantity Received?".
ASSIGN inp-qty.
io-param = io-param + inp-qty.

DEFINE BUTTON btnFind LABEL "Find Customer".
DO WITH FRAME frCustomer WITH SIDE-LABELS:
ENABLE Customer.CustNum btnFind.
ON CHOOSE OF btnFind DO:
RUN getCustomer (Customer.CustNum:HANDLE, BUFFER Customer).
IF NOT ERROR-STATUS:ERROR THEN
DISPLAY Customer EXCEPT Customer.Comments WITH SIDE-LABELS.
END.
ON ENTRY OF Customer.CustNum DO:
HIDE MESSAGE.
END.
WAIT-FOR WINDOW-CLOSE OF CURRENT-WINDOW.
END.
PROCEDURE getCustomer:
DEFINE INPUT PARAMETER hWidget AS HANDLE NO-UNDO.
DEFINE PARAMETER BUFFER bufCustomer FOR Customer.
FIND bufCustomer WHERE bufCustomer.CustNum =
INTEGER(hWidget:SCREEN-VALUE) NO-LOCK NO-ERROR.
IF NOT AVAILABLE bufCustomer THEN DO:
MESSAGE "Customer record not found." VIEW-AS ALERT-BOX.
RETURN ERROR.
END.
END.

DEFINE VARIABLE result AS INTEGER NO-UNDO.
MESSAGE " It's a whole new world!"
VIEW-AS ALERT-BOX MESSAGE BUTTONS OK TITLE "ABL Message".
RUN MessageBoxA (0, " It's a whole new world, again!!",
"ABL DLL access", 0, OUTPUT result).
PROCEDURE MessageBoxA EXTERNAL "user32.dll":
DEFINE INPUT PARAMETER hwnd AS LONG.
DEFINE INPUT PARAMETER mbtext AS CHARACTER.
DEFINE INPUT PARAMETER mbtitle AS CHARACTER.
DEFINE INPUT PARAMETER style AS LONG.
DEFINE RETURN PARAMETER result AS LONG.
END.

DEFINE INPUT PARAMETER pCase AS CHARACTER CASE-SENSITIVE.
DEFINE INPUT PARAMETER pCaseOff AS CHARACTER NOT CASE-SENSITIVE.
DEFINE INPUT PARAMETER pLabel AS CHARACTER COLUMN-LABEL "Param".
DEFINE INPUT PARAMETER pNum AS DECIMAL DECIMALS 2.
DEFINE INPUT PARAMETER pPtr AS HANDLE TO LONG.
DEFINE INPUT PARAMETER pObj AS CLASS My.Namespace.Type.
DEFINE INPUT PARAMETER TABLE-HANDLE hT BY-VALUE BIND.
DEFINE OUTPUT PARAMETER TABLE-HANDLE hTOut BY-VALUE.
DEFINE INPUT PARAMETER DATASET FOR dsData APPEND BY-VALUE.
DEFINE OUTPUT PARAMETER DATASET-HANDLE hDs BIND BY-VALUE.
DEFINE INPUT PARAMETER pExtent0 AS INTEGER EXTENT 0.

/* statements/pause.txt: PAUSE */
PAUSE.
PAUSE 1 BEFORE-HIDE MESSAGE "Wait".
PAUSE NO-MESSAGE IN WINDOW hWin.

/* statements/pause.txt: PAUSE - reference snippet and variants */
PAUSE 2 BEFORE-HIDE MESSAGE "Pausing 2 seconds".
FOR EACH Customer NO-LOCK WITH 13 DOWN:
DISPLAY Customer.CustNum Customer.Name.
END.

PAUSE 0.5 MESSAGE "Half second".
PAUSE BEFORE-HIDE NO-MESSAGE.

/* statements/preselect.txt: PRESELECT */
PRESELECT EACH Customer NO-LOCK.
PRESELECT FIRST Order OF Customer WHERE Order.Status = "OPEN".
PRESELECT Order, EACH OrderLine OF Order NO-LOCK.

/* statements/procedure.txt: PROCEDURE DEFINITION */
PROCEDURE doSomething:
  DEFINE INPUT PARAMETER pVal AS INTEGER.
  DISPLAY pVal.
END PROCEDURE.

PROCEDURE emptyProc:
END PROCEDURE.

PROCEDURE dotProc.
  MESSAGE "x".
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - MAP option */
PROCEDURE mappedProc MAP mp:
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - TABLE parameter */
PROCEDURE tableProc:
  DEFINE INPUT PARAMETER TABLE FOR Customer.
  FIND FIRST Customer NO-LOCK.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - TABLE-HANDLE parameter */
PROCEDURE tableHandleProc:
  DEFINE OUTPUT PARAMETER TABLE-HANDLE hTable NO-UNDO.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - DATASET parameter */
PROCEDURE datasetProc:
  DEFINE INPUT PARAMETER DATASET FOR dsOrders.
  FOR EACH ttOrder OF dsOrders:
    DISPLAY ttOrder.OrderNum.
  END.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - DATASET-HANDLE parameter */
PROCEDURE datasetHandleProc:
  DEFINE INPUT PARAMETER DATASET-HANDLE hDataset.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - BUFFER parameter */
PROCEDURE bufferProc:
  DEFINE PARAMETER BUFFER bufCustomer FOR Customer PRESELECT.
  FIND FIRST bufCustomer NO-LOCK.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - BUFFER TEMP-TABLE parameter */
PROCEDURE bufferTempProc:
  DEFINE PARAMETER BUFFER bufTemp FOR TEMP-TABLE ttData PRESELECT.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - TABLE with APPEND */
PROCEDURE appendProc:
  DEFINE OUTPUT PARAMETER TABLE FOR ttOrder APPEND.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - TABLE with BIND */
PROCEDURE bindProc:
  DEFINE INPUT-OUTPUT PARAMETER TABLE FOR ttData BIND.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - TABLE with BY-VALUE */
PROCEDURE byValueProc:
  DEFINE INPUT PARAMETER TABLE FOR Customer BY-VALUE.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - DATASET with APPEND */
PROCEDURE appendDsProc:
  DEFINE OUTPUT PARAMETER DATASET FOR dsAudit APPEND.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - TABLE-HANDLE with BIND */
PROCEDURE bindHandleProc:
  DEFINE OUTPUT PARAMETER TABLE-HANDLE hTable BIND NO-UNDO.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - DATASET-HANDLE with BIND */
PROCEDURE bindDsHandleProc:
  DEFINE INPUT-OUTPUT PARAMETER DATASET-HANDLE hDataSet BIND.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - Dot Header */
PROCEDURE dotBody.
END.
PROCEDURE colonBody:
END.

/* statements/procedure.txt: PROCEDURE - STANDARD parameter combinations */
PROCEDURE comboProc:
  DEFINE INPUT PARAMETER p1 AS INTEGER INITIAL 10.
  DEFINE OUTPUT PARAMETER p2 AS CHARACTER NO-UNDO FORMAT "x(50)".
  DEFINE INPUT-OUTPUT PARAMETER p3 LIKE Customer.CustNum.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - PRIVATE with CATCH/FINALLY */
PROCEDURE PRIVATE calcTotals:
  DEFINE VARIABLE i AS INTEGER NO-UNDO.
  DO ON ERROR UNDO, THROW:
    i = i + 1.
  END.
  CATCH err AS Progress.Lang.SysError:
    MESSAGE err:GetMessage(1).
  END CATCH.
  FINALLY:
    MESSAGE "cleanup".
  END FINALLY.
END PROCEDURE.

/* statements/procedure.txt: PROCEDURE - EXTERNAL and IN SUPER prototypes */
PROCEDURE MessageBoxA EXTERNAL "user32.dll":
  DEFINE INPUT PARAMETER hwnd AS LONG.
  DEFINE INPUT PARAMETER mbtext AS CHARACTER.
  DEFINE INPUT PARAMETER mbtitle AS CHARACTER.
  DEFINE INPUT PARAMETER style AS LONG.
  DEFINE RETURN PARAMETER result AS LONG.
END PROCEDURE.

PROCEDURE calcTax CDECL ORDINAL 5 PERSISTENT THREAD-SAFE EXTERNAL "tax.dll":
  DEFINE INPUT PARAMETER pAmount AS DECIMAL.
  DEFINE RETURN PARAMETER pTax AS DECIMAL.
END PROCEDURE.

PROCEDURE doSuper IN SUPER.
END.

/* statements/procedure.txt: PROCEDURE - reference snippets and EXTERNAL options */
DEFINE VARIABLE FactorialResult AS INTEGER NO-UNDO FORMAT ">>>,>>>,>>9".
DEFINE VARIABLE FactorialInput AS INTEGER NO-UNDO.
REPEAT:
SET FactorialInput VALIDATE(FactorialInput <= 12 AND FactorialInput >= 0,
"Value must be between 0 and 12.").
RUN Factorial (INPUT FactorialInput, OUTPUT FactorialResult).
DISPLAY FactorialResult.
END.
PROCEDURE Factorial:
DEFINE INPUT PARAMETER PTerm AS INTEGER NO-UNDO.
DEFINE OUTPUT PARAMETER FactorialResult AS INTEGER NO-UNDO.
DEFINE VARIABLE WorkingResult AS INTEGER NO-UNDO.
IF PTerm <= 1 THEN DO:
FactorialResult = 1.
RETURN.
END.
ELSE DO:
RUN Factorial (INPUT PTerm - 1, OUTPUT WorkingResult).
FactorialResult = PTerm * WorkingResult.
END.
END PROCEDURE.

DEFINE VARIABLE iResult AS INTEGER NO-UNDO.
MESSAGE " It's a whole new world!"
VIEW-AS ALERT-BOX MESSAGE BUTTONS OK TITLE "ABL Message".
RUN MessageBoxA (0, " It's a whole new world, again!!",
"ABL DLL Access", 0, OUTPUT iResult).
PROCEDURE MessageBoxA EXTERNAL "user32.dll":
DEFINE INPUT PARAMETER hwnd AS LONG.
DEFINE INPUT PARAMETER mbtext AS CHARACTER.
DEFINE INPUT PARAMETER mbtitle AS CHARACTER.
DEFINE INPUT PARAMETER style AS LONG.
DEFINE RETURN PARAMETER result AS LONG.
END.

PROCEDURE atoi EXTERNAL "/usr/lib/libc.so.1":
DEFINE INPUT PARAMETER val AS CHARACTER.
DEFINE RETURN PARAMETER outVal AS LONG.
END.

PROCEDURE dllProc EXTERNAL "mylib.dll":
DEFINE INPUT PARAMETER p1 AS INTEGER.
END.

PROCEDURE dllCdecl EXTERNAL "mylib.dll" CDECL ORDINAL 2 PERSISTENT THREAD-SAFE:
DEFINE INPUT PARAMETER p1 AS INTEGER.
END.

PROCEDURE dllStdcall EXTERNAL "mylib.dll" STDCALL:
DEFINE INPUT PARAMETER p1 AS INTEGER.
END.

PROCEDURE dllPascal EXTERNAL "mylib.dll" PASCAL:
DEFINE INPUT PARAMETER p1 AS INTEGER.
END.

PROCEDURE superProc IN SUPER:
DEFINE INPUT PARAMETER p1 AS INTEGER.
END.

PROCEDURE PRIVATE hiddenProc:
DEFINE INPUT PARAMETER p1 AS INTEGER.
END PROCEDURE.

PROCEDURE ANYWHERE.Click.
END.
PROCEDURE frCtrl.myOcx.Click:
END PROCEDURE.

/* statements/process-events.txt: PROCESS EVENTS statement */
PROCESS EVENTS.

/* statements/process-events.txt: PROCESS EVENTS - reference snippet */
DEFINE VARIABLE ix AS INTEGER NO-UNDO.
DEFINE VARIABLE stop-sel AS LOGICAL NO-UNDO.
DEFINE BUTTON stop-it LABEL "STOP".
DISPLAY stop-it.
ON CHOOSE OF stop-it
stop-sel = TRUE.

ENABLE stop-it.
DO ix = 1 TO 1000:
  DISPLAY ix VIEW-AS TEXT.
  PROCESS EVENTS.
  IF stop-sel THEN LEAVE.
END.

/* statements/prompt-for.txt: PROMPT-FOR */
PROMPT-FOR field1.
PROMPT-FOR field1 field2 field3.
PROMPT-FOR field1 WHEN x > 5.
PROMPT-FOR UNLESS-HIDDEN field1.
PROMPT-FOR field1 IN WINDOW w1.
PROMPT-FOR field1 WITH FRAME f1.
PROMPT-FOR field1 GO-ON(f1 f2).

/* statements/prompt-for.txt: PROMPT-FOR with format, text, constants, and editing */
PROMPT-FOR field1 FORMAT "x(10)" WHEN ok
  TEXT(field2 FORMAT "x(5)")
  "CONST" AT 5
  SKIP
  EDITING:
    READKEY.
  END.

/* statements/prompt-for.txt: PROMPT-FOR record with EXCEPT and constant VIEW-AS */
PROMPT-FOR Customer EXCEPT Comments PrivateNotes WITH FRAME fCust.
PROMPT-FOR "Notes:" TO 20 VIEW-AS TEXT FGCOLOR 12 BGCOLOR 1 FONT 2 field1.

/* statements/prompt-for.txt: PROMPT-FOR - reference snippets and stream variants */
DEFINE VARIABLE ix AS INTEGER NO-UNDO INITIAL 3.
PROMPT-FOR ix.
MESSAGE "Record buffer" ix SKIP(0) "Screen buffer" INPUT ix.

DEFINE VARIABLE s-com AS CHARACTER NO-UNDO FORMAT "x(40)" EXTENT 5.
FORM
"Shipped
:" Order.ShipDate AT 13 SKIP
"Misc Info :" Order.Instructions AT 13 SKIP(1)
"Order Comments :" s-com AT 1
WITH FRAME o-com CENTERED NO-LABELS TITLE "Shipping Information".
FOR EACH Customer NO-LOCK, EACH Order OF Customer:
DISPLAY Customer.CustNum Customer.Name Order.OrderNum Order.OrderDate
Order.PromiseDate WITH FRAME order-hdr CENTERED.
UPDATE Order.ShipDate Order.Instructions TEXT(s-com)
WITH FRAME o-com.
s-com = "".
END.

REPEAT:
PROMPT-FOR Customer.CustNum.
FIND Customer USING Customer.CustNum NO-ERROR.
IF NOT AVAILABLE Customer THEN DO:
MESSAGE "No such customer number.".
UNDO, RETRY.
END.
DISPLAY Customer.Name Customer.Phone Customer.SalesRep.
END.

REPEAT:
  PROMPT-FOR SalesRep.SalesRep LABEL "Sales rep's initials"
  WITH FRAME namefr ROW 2 SIDE-LABELS.
  FIND SalesRep NO-LOCK USING SalesRep.SalesRep.
  DISPLAY SalesRep.RepName SalesRep.Region SalesRep.MonthQuota
  WITH 1 DOWN NO-HIDE.
END.

PROMPT-FOR STREAM s1 field1 SPACE(2) SKIP(1) ^ GO-ON(F2 F3).
PROMPT-FOR STREAM-HANDLE hS field1 field2 IN WINDOW wMain WITH FRAME fMain.

/* statements/prompt-for.txt: PROMPT-FOR with NO-VALIDATE + EDITING */
PROMPT-FOR cp_cust WITH NO-VALIDATE EDITING:
  READKEY.
END.

/* statements/prompt-for.txt: PROMPT-FOR - GO-ON with quoted keys */
PROMPT-FOR code_fldname GO-ON("F5" "CTRL-D") EDITING:
  READKEY.
END.

/* statements/promsgs.txt: PROMSGS statement */
PROMSGS = "C:/msgfile.dat".
PROMSGS = cMsgFile.

/* statements/promsgs.txt: PROMSGS statement with different expression types */
PROMSGS = "promsgs".
PROMSGS = cMsgBuffer.
PROMSGS = cPath + "/" + cFile.

/* statements/promsgs.txt: PROMSGS - reference snippet */
DEFINE VARIABLE newlang AS CHARACTER NO-UNDO FORMAT "x(16)"
LABEL "Language".
DEFINE VARIABLE msgfile AS CHARACTER NO-UNDO.
SET newlang HELP "Enter the new language for messages.".
IF newlang = "English" THEN msgfile = "promsgs".
ELSE msgfile = "prolang/promsgs." + LC(SUBSTRING(newlang, 1, 3)).
IF SEARCH(msgfile) <> ? THEN DO:
PROMSGS = msgfile.
MESSAGE "Messages will now be taken from" PROMSGS.
END.
ELSE DO:
MESSAGE "Cannot find" msgfile.
UNDO, RETRY.
END.

/* statements/propath.txt: PROPATH */
PROPATH = "/app/src".
PROPATH += "/app/lib".
PROPATH = cPath + "," + cOtherPath.

/* statements/propath.txt: PROPATH - reference snippets */
DEFINE VARIABLE menu AS CHARACTER NO-UNDO EXTENT 4 FORMAT "X(20)"
INITIAL ["1. Sales","2. Acctg","3. Personnel","4. Exit"].
DEFINE VARIABLE proglist AS CHARACTER NO-UNDO EXTENT 4 FORMAT "X(8)"
INITIAL ["sales.p","acctg.p","per.p","exit.p"].
DEFINE VARIABLE ppath AS CHARACTER NO-UNDO EXTENT 4
INITIAL ["sales/s-procs","acctg/a-procs","per/p-procs",","] .

REPEAT:
  DISPLAY menu WITH TITLE " M A I N   M E N U " 1 COLUMN 1 DOWN NO-LABELS ROW 8.
  CHOOSE FIELD menu AUTO-RETURN.
  HIDE.
  PROPATH = ppath[FRAME-INDEX].
  RUN VALUE(proglist[FRAME-INDEX]).
END.

PROPATH = ENTRY(1,PROPATH) + ",/dlc,/dlc/proguide,/dlc/appl1/procs".
DISPLAY PROPATH.

PROPATH += ",/myNewAppDir1,/myNewAppDir2".

/* statements/publish.txt: PUBLISH statement */
PUBLISH "MyEvent".
PUBLISH "MyEvent" FROM hPublisher.

/* statements/publish.txt: PUBLISH - reference snippets and parameters */
DEFINE VARIABLE hPub AS HANDLE NO-UNDO.
DEFINE VARIABLE hSub1 AS HANDLE NO-UNDO.
DEFINE VARIABLE hSub2 AS HANDLE NO-UNDO.
DEFINE BUTTON bNewCust LABEL "New Customer".
DEFINE BUTTON bQuit LABEL "Quit".
RUN r-nepub.p PERSISTENT SET hPub.
RUN r-nesub1.p PERSISTENT SET hSub1 (hPub).
RUN r-nesub2.p PERSISTENT SET hSub2.
SUBSCRIBE PROCEDURE hSub2 TO "NewCustomer" IN hPub.
FORM bNewCust bQuit WITH FRAME x.
ENABLE ALL WITH FRAME x.
ON CHOOSE OF bNewCust RUN NewCust IN hPub.
WAIT-FOR CHOOSE OF bQuit OR WINDOW-CLOSE OF CURRENT-WINDOW.

PROCEDURE NewCust:
DEFINE VARIABLE name AS CHARACTER NO-UNDO INITIAL "Sam".
PUBLISH "NewCustomer" (INPUT name).
END PROCEDURE.

DEFINE INPUT PARAMETER hPub AS HANDLE NO-UNDO.
SUBSCRIBE TO "NewCustomer" IN hPub.
PROCEDURE NewCustomer:
DEFINE INPUT PARAMETER name AS CHARACTER NO-UNDO.
MESSAGE "Subscriber 1 received event NewCustomer concerning" name
VIEW-AS ALERT-BOX.
END.

PROCEDURE NewCustomer:
DEFINE INPUT PARAMETER name AS CHARACTER NO-UNDO.
MESSAGE "Subscriber 2 received event NewCustomer concerning" name
VIEW-AS ALERT-BOX.
UNSUBSCRIBE TO ALL.
END.

PUBLISH cEventName FROM hPublisher (INPUT p1, INPUT-OUTPUT p2, OUTPUT p3).

/* statements/put-bits.txt: PUT-BITS */
PUT-BITS(rawBuf, 1, 8) = 255.

/* statements/put-byte.txt: PUT-BYTE */
PUT-BYTE(rawBuf, 1) = 255.

/* statements/put-bytes.txt: PUT-BYTES */
PUT-BYTES(rawBuf, 1, 4) = memPtr.

/* statements/put-cursor.txt: PUT CURSOR */
PUT CURSOR OFF.
PUT CURSOR ROW 5.
PUT CURSOR COLUMN 10.
PUT CURSOR ROW 5 COLUMN 10.
PUT CURSOR ROW iRow COLUMN iCol.

/* statements/put-cursor.txt: PUT CURSOR - expressions */
PUT CURSOR ROW iRow + 1 COLUMN iCol - 1.

/* statements/put-double.txt: PUT-DOUBLE */
PUT-DOUBLE(rawBuf, 1) = 3.14.

/* statements/put-float.txt: PUT-FLOAT */
PUT-FLOAT(rawBuf, 1) = 2.5.

/* statements/put-int64.txt: PUT-INT64 */
PUT-INT64(rawBuf, 1) = 123456789.

/* statements/put-key-value.txt: PUT-KEY-VALUE */
PUT-KEY-VALUE SECTION "general" KEY "theme" VALUE "dark".
PUT-KEY-VALUE SECTION cSection KEY DEFAULT VALUE cValue.
PUT-KEY-VALUE COLOR 1.
PUT-KEY-VALUE FONT ALL.
PUT-KEY-VALUE SECTION "app" KEY "debug" VALUE "true" NO-ERROR.

/* statements/put-key-value.txt: PUT-KEY-VALUE - VALUE expressions */
PUT-KEY-VALUE SECTION VALUE(cSection) KEY VALUE(cKey) VALUE VALUE(cValue).

/* statements/put-key-value.txt: PUT-KEY-VALUE - reference examples */
PUT-KEY-VALUE SECTION "MYSECTION" KEY "MYKEY" VALUE MYVARIABLE.
PUT-KEY-VALUE SECTION "" KEY "MYKEY" VALUE MYVARIABLE.
PUT-KEY-VALUE SECTION "?" KEY "MYKEY" VALUE MYVARIABLE.

PUT-KEY-VALUE SECTION "MYSECTION" KEY "MYKEY" VALUE "".
PUT-KEY-VALUE SECTION "MYSECTION" KEY "MYKEY" VALUE ?.

PUT-KEY-VALUE SECTION "MYSECTION " KEY "?" VALUE ?.
PUT-KEY-VALUE SECTION "MYSECTION " KEY "" VALUE "".

PUT-KEY-VALUE SECTION "MYAPP" KEY DEFAULT VALUE "NEWVALUE".

PUT-KEY-VALUE COLOR ALL.
PUT-KEY-VALUE FONT 2.

/* statements/put-long.txt: PUT-LONG */
PUT-LONG(rawBuf, 1) = 1024.

/* statements/put-screen.txt: PUT SCREEN */
PUT SCREEN "Hello".
PUT SCREEN ROW 5 "Text".
PUT SCREEN COLUMN 10 "Text".
PUT SCREEN ROW 5 COLUMN 10 "Text".
PUT SCREEN COLOR 7 ROW 1 COLUMN 1 "Header".
PUT SCREEN COLOR NORMAL ROW 2 COLUMN 1 "Hdr".
PUT SCREEN COLOR "FF" "Hex".
PUT SCREEN COLOR BLINK-RED "Blink".

/* statements/put-screen.txt: PUT SCREEN - row/column expressions */
PUT SCREEN ROW iRow + 1 COLUMN iCol + 2 "Text".

/* statements/put-screen.txt: PUT SCREEN - reference snippet */
DEFINE VARIABLE paid-owed AS DECIMAL NO-UNDO.
DEFINE VARIABLE bal-label AS CHARACTER NO-UNDO FORMAT "x(20)".
FOR EACH Customer NO-LOCK:
paid-owed = Customer.Balance.
IF paid-owed < 0 THEN DO:
paid-owed = - paid-owed.
bal-label = "Customer Credit".
END.
ELSE bal-label = "Unpaid balance".
DISPLAY Customer.CustNum Customer.Name paid-owed LABEL " " WITH 1 DOWN.
IF Customer.Balance < 0 THEN
PUT SCREEN COLOR MESSAGES ROW 2 COLUMN 34 bal-label.
ELSE
PUT SCREEN ROW 2 COLUMN 34 bal-label.
END.

PUT SCREEN COLOR VALUE(cColor) ROW 1 COLUMN 1 "Hdr".

/* statements/put-screen.txt: PUT SCREEN - legacy order (value before ROW) and COL alias */
PUT SCREEN "Text" ROW 5.
PUT SCREEN "Text" ROW 5 COL 10.
PUT SCREEN ROW 5 COL 10 "Text".

/* statements/put-short.txt: PUT-SHORT */
PUT-SHORT(rawBuf, 1) = 42.

/* statements/put-string.txt: PUT-STRING */
PUT-STRING(rawBuf, 1) = "hi".

/* statements/put-unsigned-long.txt: PUT-UNSIGNED-LONG */
PUT-UNSIGNED-LONG(rawBuf, 1) = 4294967295.

/* statements/put-unsigned-short.txt: PUT-UNSIGNED-SHORT */
PUT-UNSIGNED-SHORT(rawBuf, 1) = 65535.

/* statements/put.txt: PUT */
PUT UNFORMATTED "# " tFcMessages.tcFcMessage SKIP.
PUT STREAM outStream "ok" FORMAT "x(4)" AT 10 SPACE(2) SKIP(1).
PUT CONTROL CHR(27) "c".
PUT UNFORMATTED x format("9999-99-99") ';'.

/* statements/put.txt: PUT - reference snippet and variants */
DEFINE STREAM s1.
OUTPUT STREAM s1 TO cus.dat.
FOR EACH Customer NO-LOCK:
PUT STREAM s1 name "/".
END.
OUTPUT STREAM s1 CLOSE.

PUT STREAM s1 "Name" TO 20 SPACE SKIP.
PUT STREAM-HANDLE hOut UNFORMATTED cVal AT 5 SKIP(2).
PUT CONTROL "~033A" NULL.
PUT CONTROL NULL(20).

/* statements/put.txt: PUT UNFORMATTED with inline preprocessor directives */
PUT UNFORMATTED
  &IF DEFINED (Description) EQ 0 &THEN ' - ' &ELSE ' "' {&Description} '"' &ENDIF
  &IF DEFINED (StatusText) EQ 0 &THEN ' - ' &ELSE ' "' {&StatusText} '"' &ENDIF
  &IF DEFINED (Project) EQ 0 &THEN ' - ' &ELSE ' "' {&Project} '"' &ENDIF
  SKIP.

/* statements/put.txt: PUT UNFORMATTED with inline IF/ELSEIF/ELSE preprocessor directive */
PUT UNFORMATTED &IF DEFINED(X) EQ 0 &THEN "a" &ELSEIF DEFINED(Y) EQ 1 &THEN "b" &ELSE "c" &ENDIF SKIP.

/* statements/query.txt: QUERY DEFINITION - Basic Syntax */
DEFINE QUERY qMain FOR Customer.
DEF QUERY qOrder FOR Sales.Order.
DEFINE QUERY qTemp FOR ttData.

/* statements/query.txt: QUERY DEFINITION - Multiple Tables */
DEFINE QUERY qMulti FOR Customer, Order, OrderLine.
DEF QUERY q2 FOR ttHeader, ttLine.

/* statements/query.txt: QUERY DEFINITION - FIELD Lists with FIELDS */
DEFINE QUERY qFields FOR Customer FIELDS (CustNum, Name, City).
DEF QUERY qOrder FOR Sales.Order FIELDS (OrderNum, CustNum, OrderDate).

/* statements/query.txt: QUERY DEFINITION - FIELD Lists with EXCEPT */
DEFINE QUERY qExcept FOR Customer EXCEPT (Notes, Comments).
DEF QUERY qOrder FOR Sales.Order EXCEPT (Status, Flag).

/* statements/query.txt: QUERY DEFINITION - FIELD Lists with FIELDS and EXCEPT */
DEFINE QUERY qFieldsExcept FOR Customer FIELDS (CustNum, Name) EXCEPT (Notes, Comments).

/* statements/query.txt: QUERY DEFINITION - Mix of FIELDS and EXCEPT */
DEFINE QUERY qMixed1 FOR Customer FIELDS (CustNum, Name), Order EXCEPT (Note).
DEF QUERY qMixed2 FOR ttHeader FIELDS (ID), ttLine EXCEPT (Skip), ttDetail FIELDS (Code).

/* statements/query.txt: QUERY DEFINITION - CACHE Option */
DEFINE QUERY qCache FOR Customer CACHE 100.
DEF QUERY qCache2 FOR Sales.Order CACHE 50.

/* statements/query.txt: QUERY DEFINITION - SCROLLING Option */
DEFINE QUERY qScroll FOR Customer SCROLLING.
DEF QUERY qScroll2 FOR Sales.Order SCROLLING.

/* statements/query.txt: QUERY DEFINITION - RCODE-INFORMATION Option */
DEFINE QUERY qRcode FOR Customer RCODE-INFORMATION.
DEF QUERY qRcode2 FOR Sales.Order SCROLLING RCODE-INFORMATION.

/* statements/query.txt: QUERY DEFINITION - All Options Combined */
DEFINE QUERY qFull FOR Customer FIELDS (CustNum, Name)
  CACHE 100
  SCROLLING
  RCODE-INFORMATION.

/* statements/query.txt: QUERY DEFINITION - Shared Scopes */
DEFINE NEW SHARED QUERY qShared FOR Customer.
DEFINE SHARED QUERY qUse FOR Order.
DEF NEW SHARED QUERY qTemp FOR ttData.

/* statements/query.txt: QUERY DEFINITION - Access Modifiers */
DEFINE PRIVATE QUERY qPriv FOR Customer.
DEFINE PROTECTED QUERY qProt FOR Sales.Order.
DEF PRIVATE QUERY qTemp FOR ttData.

/* statements/query.txt: QUERY DEFINITION - STATIC Modifier */
DEFINE STATIC QUERY qStatic FOR Customer.
DEF PROTECTED STATIC QUERY qProtStatic FOR Sales.Order.
DEFINE PRIVATE STATIC QUERY qPrivStatic FOR ttData.

/* statements/query.txt: QUERY DEFINITION - Qualified Table Names */
DEFINE QUERY qQual FOR Sales.Customer.
DEFINE QUERY qFull FOR Database.Schema.Table.
DEF QUERY q2 FOR MyProc.TempTable.

/* statements/query.txt: QUERY DEFINITION - Single Field */
DEFINE QUERY qSingle FOR Customer FIELDS (CustNum).
DEF QUERY qOne FOR Sales.Order EXCEPT (hidden).

/* statements/query.txt: QUERY DEFINITION - Complex Multi-Table Combinations */
DEFINE QUERY qComplex FOR Customer FIELDS (CustNum, Name)
  , Order FIELDS (OrderNum, CustNum)
  , OrderLine FIELDS (LineNum, ItemNum)
  CACHE 200
  SCROLLING
  RCODE-INFORMATION.

/* statements/query.txt: QUERY DEFINITION - reference snippets */
DEFINE QUERY q-salesrep FOR SalesRep.
DEFINE QUERY q-cust FOR Customer.
DEFINE BROWSE cust-brws QUERY q-cust
DISPLAY Customer.CustNum Customer.Name Customer.Phone
WITH 5 DOWN TITLE "Customer Information".
DEFINE BUTTON b_next LABEL "Next".
DEFINE BUTTON b_quit LABEL "Quit" AUTO-ENDKEY.
FORM
SalesRep.SalesRep SalesRep.RepName SalesRep.Region SalesRep.MonthQuota
WITH FRAME rep-info SIDE-LABELS TITLE "Sales Rep. Info".
FORM b_next space(5) b_quit
WITH FRAME butt-frame COLUMN 60.
ON CHOOSE OF b_next DO:
GET NEXT q-salesrep.
IF NOT AVAILABLE SalesRep THEN GET FIRST q-salesrep.
RUN disp-rep.
END.
OPEN QUERY q-salesrep FOR EACH SalesRep NO-LOCK.
GET FIRST q-salesrep.
RUN disp-rep.
ENABLE cust-brws WITH FRAME cust-info.
ENABLE ALL WITH FRAME butt-frame.
WAIT-FOR WINDOW-CLOSE OF CURRENT-WINDOW.
PROCEDURE disp-rep:
DISPLAY SalesRep.SalesRep Salesrep.RepName SalesRep.Region
SalesRep.MonthQuota
WITH FRAME rep-info CENTERED SIDE-LABELS TITLE "Sales Rep. Info".
OPEN QUERY q-cust FOR EACH Customer OF SalesRep NO-LOCK.
END PROCEDURE.

DEFINE VARIABLE h AS HANDLE NO-UNDO.
DEFINE QUERY q FOR Customer RCODE-INFORMATION.
h = QUERY q:HANDLE.
OPEN QUERY q FOR EACH Customer BY Customer.Name.
MESSAGE h:INDEX-INFORMATION.

DEFINE QUERY qEmpty FOR Customer FIELDS ().
DEFINE QUERY qExceptAll FOR Customer EXCEPT ().

/* statements/quit.txt: QUIT statement */
QUIT.

/* statements/quit.txt: QUIT - reference snippet */
DEFINE SUB-MENU cusmaint1
MENU-ITEM crecust LABEL "Create New Customer"
MENU-ITEM chgcust LABEL "Chan&ge Existing Customer"
MENU-ITEM delcust LABEL "Delete Customer"
MENU-ITEM prtcust LABEL "Print Customer List"
MENU-ITEM extcust LABEL "E&xit ABL".
DEFINE MENU mainbar MENUBAR
SUB-MENU cusmaint1 LABEL "Customer".
ON CHOOSE OF MENU-ITEM crecust
RUN newcust.p.
ON CHOOSE OF MENU-ITEM chgcust
RUN chgcust.p.
ON CHOOSE OF MENU-ITEM delcust
RUN delcust.p.
ON CHOOSE OF MENU-ITEM prtcust
RUN prncust.p.
ON CHOOSE OF MENU-ITEM extcust
QUIT.
ASSIGN
CURRENT-WINDOW:MENUBAR = MENU mainbar:HANDLE
CURRENT-WINDOW:VISIBLE = TRUE.
WAIT-FOR WINDOW-CLOSE OF CURRENT-WINDOW.

/* statements/raw-transfer.txt: RAW-TRANSFER */
RAW-TRANSFER source TO target.
RAW-TRANSFER FIELD source TO target.
RAW-TRANSFER source TO target NO-ERROR.
RAW-TRANSFER FIELD source TO dest NO-ERROR.

/* statements/raw-transfer.txt: RAW-TRANSFER - reference example and variants */
TRIGGER PROCEDURE FOR REPLICATION-CREATE OF Customer.
CREATE Replication-Log.
ASSIGN
Replication-Log.Taskid = DBTASKID(LDBNAME(BUFFER Replication-Log))
Replication-Log.Table = 'Customer'
Replication-Log.Action = 'CREATE'.
RAW-TRANSFER Customer TO Replication-Log.Record.

RAW-TRANSFER BUFFER srcBuf TO FIELD rawField.
RAW-TRANSFER FIELD rawField TO BUFFER tgtBuf.
RAW-TRANSFER BUFFER srcBuf TO BUFFER tgtBuf.
RAW-TRANSFER BUFFER srcBuf TO FIELD rawField NO-ERROR.

/* statements/readkey.txt: READKEY statement */
READKEY.
READKEY PAUSE 5.
READKEY STREAM sIn PAUSE 10.

/* statements/readkey.txt: READKEY - reference snippet and variants */
FOR EACH Customer:
DISPLAY Customer.CustNum Customer.Name Customer.Address Customer.City
Customer.State WITH 1 DOWN.
MESSAGE "If you want to delete this customer, press Y".
MESSAGE "Otherwise, press any other key.".
READKEY.
IF CHR(LASTKEY) = "Y" THEN DELETE Customer.
ELSE IF KEYFUNCTION(LASTKEY) = "END-ERROR" THEN LEAVE.
END.

READKEY STREAM-HANDLE hIn PAUSE 0.
READKEY PAUSE 0.5.

/* statements/rectangle.txt: RECTANGLE basic definition */
DEFINE RECTANGLE rectMain SIZE 80 BY 20.

/* statements/rectangle.txt: RECTANGLE with edge options */
DEFINE RECTANGLE rectBorder
  EDGE-PIXELS 2
  NO-FILL
  FGCOLOR 15
  SIZE 40 BY 10.

/* statements/rectangle.txt: RECTANGLE with LIKE */
DEFINE RECTANGLE rect2 LIKE rect1 ROUNDED.

/* statements/rectangle.txt: RECTANGLE with GROUP-BOX */
DEF RECTANGLE rectGroup
  GROUP-BOX
  SIZE-CHARS 50 BY 8
  BGCOLOR 8.

/* statements/rectangle.txt: RECTANGLE private with tooltip */
DEFINE PRIVATE RECTANGLE rectPrivate
  EDGE-CHARS 1
  TOOLTIP "Border rectangle"
  SIZE-PIXELS 200 BY 100.

/* statements/rectangle.txt: RECTANGLE - Basic Syntax */
DEFINE RECTANGLE rBox.
DEF RECTANGLE rFrame.

/* statements/rectangle.txt: RECTANGLE - NO-FILL */
DEFINE RECTANGLE rNoFill NO-FILL.
DEF RECTANGLE rOutline NO-FILL.

/* statements/rectangle.txt: RECTANGLE - EDGE-CHARS */
DEFINE RECTANGLE rEdgeChar EDGE-CHARS 2.
DEF RECTANGLE rEdge2 EDGE-CHARS 1.

/* statements/rectangle.txt: RECTANGLE - EDGE-PIXELS */
DEFINE RECTANGLE rEdgePix EDGE-PIXELS 3.
DEF RECTANGLE rEP2 EDGE-PIXELS 5.

/* statements/rectangle.txt: RECTANGLE - DCOLOR */
DEFINE RECTANGLE rDcolor DCOLOR 5.
DEF RECTANGLE rDC DCOLOR 10.

/* statements/rectangle.txt: RECTANGLE - BGCOLOR */
DEFINE RECTANGLE rBg BGCOLOR 2.
DEF RECTANGLE rBgColor BGCOLOR 7.

/* statements/rectangle.txt: RECTANGLE - FGCOLOR */
DEFINE RECTANGLE rFg FGCOLOR 1.
DEF RECTANGLE rFgColor FGCOLOR 15.

/* statements/rectangle.txt: RECTANGLE - GRAPHIC-EDGE */
DEFINE RECTANGLE rGraphic GRAPHIC-EDGE.
DEF RECTANGLE rGE GRAPHIC-EDGE NO-FILL.

/* statements/rectangle.txt: RECTANGLE - PFCOLOR */
DEFINE RECTANGLE rPf PFCOLOR 3.
DEF RECTANGLE rPF PFCOLOR 8.

/* statements/rectangle.txt: RECTANGLE - ROUNDED */
DEFINE RECTANGLE rRounded ROUNDED.
DEF RECTANGLE rRound ROUNDED NO-FILL.

/* statements/rectangle.txt: RECTANGLE - TOOLTIP */
DEFINE RECTANGLE rToolTip TOOLTIP "Rectangle tooltip".
DEF RECTANGLE rTT TOOLTIP text.

/* statements/rectangle.txt: RECTANGLE - PRIVATE Modifier */
DEFINE PRIVATE RECTANGLE privRect.
DEF PRIVATE RECTANGLE privBox LIKE rBox.

/* statements/rectangle.txt: RECTANGLE - Color Combinations */
DEFINE RECTANGLE rColors NO-FILL BGCOLOR 1 FGCOLOR 2 PFCOLOR 3 DCOLOR 4.
DEF RECTANGLE rMix GRAPHIC-EDGE BGCOLOR 5 PFCOLOR 6.

/* statements/rectangle.txt: RECTANGLE - LIKE with Other Options */
DEFINE RECTANGLE rLikeOther LIKE rBox BGCOLOR 5 FGCOLOR 10.
DEF RECTANGLE rCopy2 LIKE rFrame NO-FILL SIZE 20 BY 30.

/* statements/rectangle.txt: RECTANGLE - All Edge Options */
DEFINE RECTANGLE rEdge1 EDGE-CHARS 1 BGCOLOR 2.
DEF RECTANGLE rEdge2 EDGE-PIXELS 3 FGCOLOR 5 NO-FILL.
DEF RECTANGLE rEdge3 GRAPHIC-EDGE ROUNDED.

/* statements/rectangle.txt: RECTANGLE - Complete Combination */
DEFINE RECTANGLE rComplete
  NO-FILL
  EDGE-CHARS 2
  BGCOLOR 1
  FGCOLOR 2
  PFCOLOR 3
  DCOLOR 4
  ROUNDED
  SIZE-PIXELS 100 BY 150
  TOOLTIP "Complete rectangle".

/* statements/rectangle.txt: RECTANGLE - Edge Zero */
DEFINE RECTANGLE rNoEdge EDGE-CHARS 0.
DEF RECTANGLE rNoEdge2 EDGE-PIXELS 0.

/* statements/rectangle.txt: RECTANGLE - Minimal */
DEFINE RECTANGLE r.
DEF RECTANGLE r2 LIKE other.
DEF RECTANGLE r3 NO-FILL.

/* statements/rectangle.txt: RECTANGLE - reference snippet */
DEFINE VARIABLE item-tot AS DECIMAL NO-UNDO LABEL "Value".
DEFINE RECTANGLE vline1 SIZE .4 BY 5 EDGE-PIXELS 2.
DEFINE RECTANGLE vline2 LIKE vline1.
DEFINE RECTANGLE vline3 LIKE vline1.
DEFINE RECTANGLE vline4 LIKE vline1.
DEFINE RECTANGLE vline5 LIKE vline1.
DEFINE RECTANGLE vline6 LIKE vline1.
DEFINE RECTANGLE hline SIZE 78 BY .1 EDGE-PIXELS 2.
DEFINE FRAME item-info
Item.ItemNum
Item.ItemName
Item.OnHand
Item.ReOrder
Item.OnOrder
Item.Price
item-tot
BACKGROUND SKIP(1) hline
vline1 AT 9
vline2 AT 25
vline3 AT 33
vline4 AT 42
vline5 AT 51
vline6 AT 65
WITH TITLE "Inventory Current Value" CENTERED USE-TEXT 5 DOWN.
FOR EACH Item NO-LOCK WITH FRAME item-info:
  DISPLAY
  Item.ItemNum
  Item.ItemName
  Item.OnHand
  Item.ReOrder
  Item.OnOrder
  Item.Price
  Item.OnHand * Item.Price @ item-tot.
END.

/* statements/rectangle.txt: RECTANGLE - partial keyword (RECT, RECTAN) */
DEFINE RECT r1.
DEFINE RECTAN r2 NO-FILL.

/* statements/release-external.txt: RELEASE EXTERNAL */
RELEASE EXTERNAL "mylib.dll".
RELEASE EXTERNAL PROCEDURE "kernel32.dll".

/* statements/release-external.txt: RELEASE EXTERNAL - reference example */
RELEASE EXTERNAL PROCEDURE "mystuff.dll".
RELEASE EXTERNAL "libc.so.1".

/* statements/release-object.txt: RELEASE OBJECT */
RELEASE OBJECT hWidget.
RELEASE OBJECT hBuffer NO-ERROR.

/* statements/release-object.txt: RELEASE OBJECT - object access handle */
RELEASE OBJECT hFrame:HANDLE.

/* statements/release-object.txt: RELEASE OBJECT - reference snippet */
DEFINE VARIABLE CFWidHdl AS HANDLE NO-UNDO.
DEFINE VARIABLE CFComHdl AS COM-HANDLE NO-UNDO.
DEFINE VARIABLE controlHdl AS COM-HANDLE NO-UNDO.
CREATE CONTROL-FRAME CFWidHdl ASSIGN
  FRAME = FRAME foo:HANDLE
  NAME = "ctlFrame1".

CFComHdl = CFWidHdl:COM-HANDLE.
CFComHdl:LoadControls(hc_CmdButton.wrx, "hc_CmdButton").
controlHdl = CFComHdl:hc_CmdButton.
controlHdl:BgColor = RGB-VALUE(0,128,0).
RELEASE OBJECT controlHdl.
DELETE WIDGET CFWidHdl.

RELEASE OBJECT controlHdl NO-ERROR.

/* statements/release.txt: RELEASE */
RELEASE cust NO-ERROR.
RELEASE order_hdr.

/* statements/release.txt: RELEASE - reference snippet */
DEFINE VARIABLE methRtn AS LOGICAL NO-UNDO.
DEFINE VARIABLE curr-cust AS ROWID NO-UNDO.
DEFINE BUTTON upd-cust LABEL "Update Customer".
DEFINE BUTTON exit-app LABEL "Exit".
DEFINE QUERY seq-cust FOR customer.
DEFINE BROWSE brow-cust QUERY seq-cust
DISPLAY Customer.CustNum Customer.Name WITH 10 DOWN.
FORM
upd-cust exit-app SKIP(1)
brow-cust
WITH FRAME main-frame.
FORM
Customer EXCEPT Customer.Comments
WITH FRAME curr-frame COLUMN 40.
OPEN QUERY seq-cust FOR EACH Customer.
ON VALUE-CHANGED OF brow-cust DO:
DISPLAY Customer EXCEPT Customer.Comments
WITH FRAME curr-frame SIDE-LABELS.
curr-cust = ROWID(Customer).
END.
ON CHOOSE OF upd-cust DO:
FIND Customer WHERE ROWID(Customer) = curr-cust EXCLUSIVE-LOCK.
UPDATE Customer WITH FRAME cust-frame VIEW-AS DIALOG-BOX
TITLE "Customer Update".
methRtn = brow-cust:REFRESH().
DISPLAY Customer EXCEPT Customer.Comments
WITH FRAME curr-frame SIDE-LABELS.
RELEASE Customer.
END.
ENABLE ALL WITH FRAME main-frame.
APPLY "VALUE-CHANGED" TO brow-cust.
PAUSE 0 BEFORE-HIDE.
WAIT-FOR CHOOSE OF exit-app OR WINDOW-CLOSE OF DEFAULT-WINDOW.

RELEASE sports.Customer NO-ERROR.

/* statements/repeat.txt: REPEAT */
REPEAT:
  DISPLAY x.
END.

REPEAT WHILE x < 5:
  x = x + 1.
END.

REPEAT UNTIL done:
  DISPLAY done.
END.

main: REPEAT ON STOP UNDO, RETURN ERROR "x" ON ERROR UNDO, THROW:
  LEAVE.
END.

choose_label: REPEAT:
  MESSAGE "ok".
END.

/* statements/repeat.txt: REPEAT - reference snippet and options */
DEFINE VARIABLE Selection AS INTEGER NO-UNDO FORMAT "9".
FORM SKIP(3)
"0 - Exit" at 32
"1 - Edit Customer File" at 32
"2 - List Customer File" at 32
"3 - Edit Item File" at 32
"4 - List Item File" at 32
"Enter Choice" TO 30 Selection AUTO-RETURN
HEADER "Application Name" "Master Menu" AT 34
WITH NO-BOX NO-LABELS CENTERED FRAME menu.

REPEAT ON ENDKEY UNDO, RETRY:
  UPDATE Selection WITH FRAME menu.
  HIDE FRAME menu.
  CASE(Selection):
    WHEN 0 THEN LEAVE.
    WHEN 1 THEN RUN custedit.p.
    WHEN 2 THEN RUN custrpt.p.
    WHEN 3 THEN RUN itemedit.p.
    WHEN 4 THEN RUN itemrpt.p.
  OTHERWISE DO:
    BELL.
    MESSAGE "Not a valid choice. Try again.".
    END.
  END CASE.
END.

REPEAT FOR Customer PRESELECT EACH Customer BREAK BY Customer.Name:
FIND NEXT Customer.
UPDATE Customer.CustNum.
END.

REPEAT i = 1 TO 10 BY 2 TRANSACTION STOP-AFTER 5 ON QUIT UNDO, LEAVE:
DISPLAY i.
END.

REPEAT QUERY-TUNING (CACHE-SIZE 10 LOOKAHEAD NO-LOOKAHEAD NO-BIND-WHERE INDEX-HINT NO-INDEX-HINT SEPARATE-CONNECTION NO-SEPARATE-CONNECTION DEBUG EXTENDED NO-DEBUG JOIN-BY-SQLDB NO-JOIN-BY-SQLDB):
DISPLAY "q".
END.

REPEAT ON ENDKEY UNDO, RETURN NO-APPLY:
  MESSAGE "x".
END.

REPEAT WITH FRAME fA ON END-KEY UNDO, LEAVE:
  HIDE FRAME fA.
END.

/* statements/reposition.txt: REPOSITION statement */
REPOSITION qCust TO ROW 5.
REPOSITION qCust FORWARDS 10.
REPOSITION qCust BACKWARDS 5.
REPOSITION qCust TO ROWID rCust.

/* statements/reposition.txt: REPOSITION - reference snippet and variants */
DEFINE VARIABLE num AS INTEGER NO-UNDO INITIAL 1.
DEFINE QUERY q-order FOR Customer, Order SCROLLING.
DEFINE BUTTON b_quit LABEL "Quit".
DEFINE BUTTON b_frwd LABEL "FORWARD".
DEFINE BUTTON b_back LABEL "BACKWARD".
FORM b_frwd b_back b_quit
WITH FRAME butt-frame ROW 1.
ON CHOOSE OF b_back, b_frwd DO:
PROMPT-FOR num LABEL "Records To Skip"
WITH FRAME pos-info CENTERED ROW 5 overlay.
HIDE FRAME pos-info NO-PAUSE.
IF SELF:LABEL = "BACKWARD" THEN
REPOSITION q-order BACKWARDS INPUT num + 1.
ELSE
REPOSITION q-order FORWARDS INPUT num - 1.
RUN getone.
END.
OPEN QUERY q-order FOR EACH Customer NO-LOCK,
EACH Order OF Customer NO-LOCK.
RUN getone.
ENABLE b_back b_frwd b_quit WITH FRAME butt-frame.
WAIT-FOR CHOOSE OF b_quit OR WINDOW-CLOSE OF CURRENT-WINDOW.
PROCEDURE getone:
GET NEXT q-order.
IF NOT AVAILABLE Customer THEN DO:
REPOSITION q-order BACKWARDS 1.
GET NEXT q-order.
END.
DISPLAY Customer.CustNum Customer.Name SKIP
Order.OrderNum Order.OrderDate
WITH FRAME order-info CENTERED ROW 5 SIDE-LABELS OVERLAY.
END PROCEDURE.

REPOSITION qCust FORWARD 5.
REPOSITION qCust BACKWARD (n - 1).
REPOSITION qCust TO RECID rCust NO-ERROR.
REPOSITION qCust TO ROWID rTop, rChild FOR TENANT tenantId NO-ERROR.

/* statements/return.txt: RETURN */
RETURN.
RETURN myValue.

/* statements/return.txt: RETURN with various expression types */
RETURN TRUE.
RETURN FALSE.
RETURN cValue.
RETURN nIndex.
RETURN rValue.

/* statements/return.txt: RETURN with complex expressions */
RETURN cResult.
RETURN cName + ", " + cValue.
RETURN nIndex + 1.

/* statements/return.txt: RETURN with function call */
RETURN CalculateResult().

/* statements/return.txt: RETURN - reference snippets and ERROR/NO-APPLY */
DEFINE VARIABLE dTemp AS DECIMAL NO-UNDO INITIAL 0.
FUNCTION CtoF RETURNS DECIMAL (INPUT dCelsius AS DECIMAL):
RETURN (dCelsius * 1.8) + 32.
END.
MESSAGE dTemp "degrees Celsius is" CtoF(dTemp) "degrees Fahrenheit." SKIP
VIEW-AS ALERT-BOX.

DEFINE VARIABLE iFuncReturn AS INTEGER INITIAL 99 NO-UNDO.
FUNCTION ErrorTest RETURNS INTEGER:
RETURN ERROR.
END FUNCTION.
ASSIGN iFuncReturn = ErrorTest().
IF iFuncReturn EQ ? THEN
MESSAGE "Error in user-defined function." view-as alert-box.

DEF VAR ix AS INT.
RUN proc NO-ERROR.
IF ERROR-STATUS:ERROR THEN
DO:
DO ix = 1 TO ERROR-STATUS:NUM-MESSAGES:
MESSAGE ERROR-STATUS:GET-MESSAGE(ix) ERROR-STATUS:GET-NUMBER(ix).
END.
END.
PROCEDURE proc:
DEFINE VAR err AS PROGRESS.Lang.AppError.
err = NEW PROGRESS.Lang.AppError("The car cannot be rented",1).
err:AddMessage ("No driver's license was provided", 98).
RETURN ERROR err.
END.

RETURN ERROR "Oops".
RETURN NO-APPLY.

/* statements/run-stored-procedure.txt: RUN STORED-PROCEDURE basic */
RUN STORED-PROCEDURE sp_GetCustomers.
RUN STORED-PROCEDURE "sp_Update".

/* statements/run-stored-procedure.txt: RUN STORED-PROCEDURE with handle */
RUN STORED-PROCEDURE sp_Query hProc = PROC-HANDLE.

/* statements/run-stored-procedure.txt: RUN STORED-PROCEDURE with LOAD-RESULT-INTO */
RUN STORED-PROCEDURE sp_GetData LOAD-RESULT-INTO hResult.
RUN STORED-PROCEDURE sp_Query LOAD-RESULT-INTO hResult iStatus = PROC-STATUS.

/* statements/run-stored-procedure.txt: RUN STORED-PROCEDURE with parameters */
RUN STORED-PROCEDURE sp_Insert (INPUT "John", INPUT 25).
RUN STORED-PROCEDURE sp_Update (PARAM custId = iCustId, OUTPUT cResult).
RUN STORED-PROCEDURE sp_Query NO-ERROR (1, 2, 3).

/* statements/run-stored-procedure.txt: RUN STORED-PROCEDURE - reference snippets */
DEFINE VARIABLE intvar AS INTEGER NO-UNDO.
RUN STORED-PROCEDURE pcust intvar = PROC-HANDLE NO-ERROR
(10, OUTPUT 0, OUTPUT 0).
FOR EACH proc-text-buffer WHERE PROC-HANDLE = intvar:
DISPLAY proc-text-buffer.
END.
IF ERROR-STATUS:ERROR THEN
MESSAGE "Stored Procedure failed to run".
ELSE
CLOSE STORED-PROCEDURE pcust WHERE PROC-HANDLE = intvar.

DEFINE VAR handle1 AS INTEGER.
RUN STORED-PROCEDURE send-sql-statement handle1 = PROC-HANDLE
("SELECT name, cust_num FROM customer").
FOR EACH proc-text-buffer WHERE PROC-HANDLE = handle1:
DISPLAY proc-text.
END.
CLOSE STORED-PROCEDURE send-sql-statement WHERE PROC-HANDLE = handle1.

DEFINE VAR h1 AS INTEGER NO-UNDO.
DEFINE VAR jx AS INTEGER NO-UNDO.
RUN STORED-PROCEDURE send-sql-statement h1 = PROC-HANDLE NO-ERROR
("select count (*) from xxx.customer where name between 'A' and 'Z' ").
IF ERROR-STATUS:ERROR THEN
DO jx = 1 TO ERROR-STATUS:NUM-MESSAGES:
MESSAGE "error" ERROR-STATUS:GET-NUMBER(jx)
ERROR-STATUS:GET-MESSAGE(jx).
END.
CLOSE STORED-PROCEDURE send-sql-statement WHERE PROC-HANDLE = h1.

DEFINE VARIABLE res AS INTEGER NO-UNDO INITIAL 0.
DEFINE VARIABLE tthndl AS HANDLE.
CREATE TEMP-TABLE tthndl.
RUN STORED-PROCEDURE send-sql-statement LOAD-RESULT-INTO tthndl
res = PROC-STATUS ("SELECT * FROM customer").
IF (res = 1) THEN
DISPLAY "Succeeded".

/* statements/run.txt: RUN basic procedure */
RUN myproc.p.
RUN someproc.p.
RUN utilities/helper.p.

/* statements/run.txt: RUN with arguments OUTPUT DATASET */
RUN proxy/starttransaction.p (OUTPUT DATASET tFcMessages, OUTPUT bFinApiError).

/* statements/run.txt: RUN with INPUT-OUTPUT DATASET */
RUN someproc.p (INPUT-OUTPUT DATASET dsOrder, INPUT DATASET dsOther:HANDLE).

/* statements/run.txt: RUN with simple arguments */
RUN calculate.p (INPUT x, INPUT y, OUTPUT result).
RUN process.p (1, "hello", TRUE).

/* statements/run.txt: RUN internal procedure */
RUN processData.
RUN validate-input.
RUN ip_calculate.

/* statements/run.txt: RUN internal procedure with arguments */
RUN processData (INPUT cValue, OUTPUT lResult).
RUN validateOrder (orderId, customerId).

/* statements/run.txt: RUN with object method call */
RUN utils.helpers.

/* statements/run.txt: RUN with path variations */
RUN data/import/customers.p.
RUN ../shared/utilities.p.
RUN ./local/process.p.

/* statements/run.txt: RUN with multiple arguments */
RUN processRecord.p (cCustomer, lSuccess).

/* statements/run.txt: RUN with expression arguments */
RUN calc.p (x + y, STRING(TODAY), SUBSTRING(name, 1, 10)).

/* statements/run.txt: RUN - reference snippets and async/server options */
DEFINE INPUT PARAMETER invDate AS DATE NO-UNDO.
DEFINE VARIABLE sh AS HANDLE NO-UNDO.
DEFINE VARIABLE ah AS HANDLE NO-UNDO.
CREATE SERVER sh.
sh:CONNECT("-URL http://slater:8810/inventory/apsv -sessionModel Session-free").
RUN runReport.p ON SERVER sh
ASYNCHRONOUS SET ah EVENT-HANDLER "reportDone" EVENT-HANDLER-CONTEXT THIS-PROCEDURE
(invDate, OUTPUT numLines AS INTEGER).
RETURN.
PROCEDURE reportDone:
DEFINE INPUT PARAMETER numLines AS INTEGER.
IF ah:ERROR OR ah:STOP THEN
MESSAGE "An error occurred when running your" SKIP
"Inventory report for" invDate "." SKIP
"The error is:" ERROR-STATUS:GET-MESSAGE(1)
VIEW-AS ALERT-BOX.
ELSE
MESSAGE "Your Inventory report for " invDate SKIP
"has completed successfully." SKIP
numLines "report lines were generated"
VIEW-AS ALERT-BOX.
sh:DISCONNECT().
DELETE OBJECT sh.
DELETE OBJECT THIS-PROCEDURE.
END PROCEDURE.

RUN aproc.p SINGLE-RUN SET procHandle ON SERVER serverHandle.
RUN internalProcA IN procHandle (INPUT argIn1, OUTPUT argout1).
DELETE PROCEDURE procHandle.

RUN aproc.p SINGLETON SET procHandle ON SERVER serverHandle.
RUN internalProcA IN procHandle (INPUT argIn1, OUTPUT argout1).
RUN internalProcB IN procHandle (INPUT argIn1, OUTPUT argout1).
DELETE PROCEDURE procHandle.

RUN /usr/foo/app.pl<<appmenu.r>>.
RUN VALUE(cProcName) PERSISTENT SET hProc.
RUN internalProc IN hProc ASYNCHRONOUS EVENT-PROCEDURE "done" IN THIS-PROCEDURE.
RUN methodProc IN hProc NO-ERROR.

/* statements/run.txt: RUN IN handle with multiline arguments */
RUN CreateBufferHeader IN reportHandle
  (bufferName, "Sales Order Header").

/* statements/run.txt: RUN with DATASET-HANDLE output and BUFFER handle argument */
RUN RunReport (OUTPUT DATASET-HANDLE phReportResults).
RUN buildBuffer (BUFFER ttReportOptions:HANDLE).

/* statements/run.txt: RUN with macro-concatenated argument identifier */
RUN x (INPUT oid_{&QXO-TABLE}).

/* statements/save-cache.txt: SAVE CACHE */
SAVE CACHE CURRENT mydb TO "cache.bin".
SAVE CACHE COMPLETE mydb TO "cache.bin".
SAVE CACHE CURRENT VALUE(cDB) TO VALUE(cPath).
SAVE CACHE COMPLETE mydb TO "/tmp/cache" NO-ERROR.

/* statements/save-cache.txt: SAVE CACHE - reference snippet */
DEFINE VARIABLE db-name AS CHARACTER NO-UNDO FORMAT "x(12)" INITIAL ?.
DEFINE VARIABLE icnt AS INTEGER NO-UNDO.
DO WHILE db-name <> "":
SET db-name LABEL "Database Name"
WITH FRAME A SIDE-LABELS TITLE "Save Cache" VIEW-AS DIALOG-BOX.
IF db-name <> "" THEN
CONNECT VALUE(db-name) -1 NO-ERROR.
ELSE LEAVE.
IF NOT ERROR-STATUS:ERROR THEN DO:
SAVE CACHE COMPLETE VALUE(db-name) TO VALUE(db-name + ".csh") NO-ERROR.
IF NOT ERROR-STATUS:ERROR THEN
MESSAGE "Saved schema cache for" db-name "in" db-name + ".csh.".
ELSE DO:
BELL.
DO icnt = 1 TO ERROR-STATUS:NUM-MESSAGES:
MESSAGE ERROR-STATUS:GET-MESSAGE(icnt) VIEW-AS ALERT-BOX.
END.
END.
END.
ELSE DO:
BELL.
DO icnt = 1 TO ERROR-STATUS:NUM-MESSAGES:
MESSAGE ERROR-STATUS:GET-MESSAGE(icnt) VIEW-AS ALERT-BOX.
END.
END.
DISCONNECT VALUE(db-name) NO-ERROR.
END.

/* statements/scroll.txt: SCROLL statement */
SCROLL.
SCROLL UP.
SCROLL DOWN.
SCROLL FROM-CURRENT UP.
SCROLL FROM-CURRENT DOWN WITH FRAME myframe.

/* statements/scroll.txt: SCROLL - reference snippet */
DEFINE VARIABLE ans AS CHARACTER NO-UNDO FORMAT "x".
FORM Customer.CustNum Customer.Name Customer.CreditLimit
WITH FRAME cust CENTERED 10 DOWN.
FORM
"1 - scroll up" SKIP
"2 - scroll from-current up" SKIP
"3 - scroll down" SKIP
"4 - scroll from-current down" SKIP
"5 - scroll from-current "
WITH FRAME instruct CENTERED TITLE "Instructions:".
VIEW FRAME cust.
REPEAT WHILE FRAME-LINE(cust) <= FRAME-DOWN(cust):
FIND NEXT Customer NO-LOCK.
DISPLAY Customer.CustNum Customer.Name Customer.CreditLimit
WITH FRAME cust TITLE "Customers".
DOWN WITH FRAME cust.
END.
UP FRAME-DOWN(cust) / 2 WITH FRAME cust.
VIEW FRAME instruct.
REPEAT WITH FRAME cust:
CHOOSE ROW Customer.Name KEYS ans AUTO-RETURN NO-ERROR WITH FRAME cust.
IF ans = "1" THEN SCROLL UP.
ELSE IF ans = "2" THEN SCROLL FROM-CURRENT UP.
ELSE IF ans = "3" THEN SCROLL DOWN.
ELSE IF ans = "4" THEN SCROLL FROM-CURRENT DOWN.
ELSE IF ans = "5" THEN SCROLL FROM-CURRENT.
VIEW FRAME cust.
ans = "".
END.

/* statements/seek.txt: SEEK */
SEEK INPUT TO pos.
SEEK STREAM outStream TO END.

/* statements/seek.txt: SEEK - reference snippet and variants */
DEFINE VARIABLE savepos AS INT64 NO-UNDO.
DEFINE VARIABLE c AS CHARACTER NO-UNDO FORMAT "x(20)".
OUTPUT TO seek.out APPEND NO-ECHO.
savepos = SEEK(OUTPUT).
PUT UNFORMATTED "abcdefg" SKIP.
OUTPUT CLOSE.
INPUT FROM seek.out NO-ECHO.
SEEK INPUT TO savepos.
SET c.
DISPLAY c.
INPUT CLOSE.

SEEK OUTPUT TO 0.
SEEK STREAM s1 TO END.
SEEK STREAM-HANDLE hS TO 100.

/* statements/set-byte-order.txt: SET-BYTE-ORDER */
SET-BYTE-ORDER(bufData) = BIG-ENDIAN.
SET-BYTE-ORDER(bufData) = 2.

/* statements/set-byte-order.txt: SET-BYTE-ORDER - keyword variants */
SET-BYTE-ORDER(bufData) = HOST-BYTE-ORDER.
SET-BYTE-ORDER(bufData) = LITTLE-ENDIAN.

/* statements/set-byte-order.txt: SET-BYTE-ORDER - object access buffer */
SET-BYTE-ORDER(hBuf:HANDLE) = HOST-BYTE-ORDER.

/* statements/set-pointer-value.txt: SET-POINTER-VALUE */
SET-POINTER-VALUE(pData) = 0.
SET-POINTER-VALUE(pBuffer) = GET-POINTER-VALUE(pSource).

/* statements/set-pointer-value.txt: SET-POINTER-VALUE - object access target */
SET-POINTER-VALUE(hBuf:HANDLE) = pOther.

/* statements/set-pointer-value.txt: SET-POINTER-VALUE - reference snippet */
DEFINE VARIABLE person_struct AS MEMPTR NO-UNDO.
DEFINE VARIABLE name AS MEMPTR NO-UNDO.
SET-SIZE(person_struct) = 8.
RUN person_info (OUTPUT person_struct).
SET-POINTER-VALUE(name) = GET-LONG(person_struct,5).
DISPLAY GET-STRING(name,1) FORMAT "x(50)".
SET-SIZE(person_struct) = 0.
PROCEDURE person_info EXTERNAL "person.dll" PERSISTENT:
DEFINE OUTPUT PARAMETER person_struct AS MEMPTR.
END PROCEDURE.

/* statements/set-size.txt: SET-SIZE */
SET-SIZE(bufData) = 16.

/* statements/set-size.txt: SET-SIZE - reference snippet */
DEFINE VARIABLE ElipRegion AS MEMPTR NO-UNDO.
ASSIGN
SET-SIZE(ElipRegion) = 8
PUT-SHORT(ElipRegion, 1) = 10
PUT-SHORT(ElipRegion, 3) = 10
PUT-SHORT(ElipRegion, 5) = 200
PUT-SHORT(ElipRegion, 7) = 50.

SET-SIZE(ElipRegion) = 0.

/* statements/set-size.txt: SET-SIZE - expression size */
SET-SIZE(bufData) = LENGTH(cData).

/* statements/set.txt: SET */
SET field1.
SET field1 field2 field3.
SET field1 WHEN x > 5.
SET UNLESS-HIDDEN field1.
SET STREAM s1 field1.
SET field1 WITH FRAME f1.
SET field1 WITH FRAME f1 NO-ERROR.
SET tng_dostawa[1] = so_ship tng_nabyw[1] = so_cust.
SET field1 GO-ON(f1 f2).

/* statements/set.txt: SET GO-ON with comma-separated strings */
SET field1 GO-ON("F5","CTRL-D").

/* statements/set.txt: SET with format, text, constants, and editing */
SET field1 FORMAT "x(10)" WHEN ok
  TEXT(field2 FORMAT "x(5)")
  "CONST" AT 5
  field3 = 10
  SKIP
  EDITING:
    READKEY.
  END.

/* statements/set.txt: SET - reference snippets and variants */
FOR EACH Item:
DISPLAY Item.ItemNum.
SET Item.ItemName Item.OnHand Item.Allocated Item.Price.
END.

FOR EACH Customer:
DISPLAY Customer.CustNum Customer.Name Customer.CreditLimit.
SET Customer.Name Customer.CreditLimit
VALIDATE(Customer.CreditLimit > 0, "Invalid credit limit.")
HELP "Enter a positive credit-limit.".
REPEAT:
CREATE Order.
Order.CustNum = Customer.CustNum.
SET Order.OrderNum Order.ShipDate VALIDATE(Order.ShipDate > TODAY,
"Ship date too early.").
END.
END.

DEFINE VARIABLE s-com AS CHARACTER NO-UNDO FORMAT "x(40)" EXTENT 5.
FORM "Shipped
:" Order.ShipDate AT 13 SKIP
"Misc Info :" Order.Instructions AT 13 SKIP(1)
"Order Comments :" s-com AT 1
WITH FRAME o-com CENTERED NO-LABELS TITLE "Shipping Information".
FOR EACH Customer NO-LOCK, EACH Order OF Customer:
DISPLAY Customer.CustNum Customer.Name Order.OrderNum
Order.OrderDate Order.PromiseDate WITH FRAME order-hdr CENTERED.
UPDATE Order.ShipDate Order.Instructions TEXT(s-com)
WITH FRAME o-com.
s-com = "".
END.

SET STREAM-HANDLE hS field1 SPACE(2) SKIP(1) ^ GO-ON(F2 F3).
SET Customer EXCEPT Comments WITH FRAME fCust NO-ERROR.

/* statements/show-stats.txt: SHOW-STATS */
SHOW-STATS.
SHOW-STATS CLEAR.

/* statements/show-stats.txt: SHOW-STATS - reference snippet */
RUN dict.p.
SHOW-STATS.

/* statements/status.txt: STATUS statement */
STATUS DEFAULT "Processing...".
STATUS INPUT "Enter data".
STATUS INPUT OFF.
STATUS DEFAULT.

/* statements/status.txt: STATUS - reference snippet */
STATUS DEFAULT "All Around Sports Order Processing System".
STATUS INPUT "Enter data, or use the " + KBLABEL("END-ERROR") +
" key to exit".
FOR EACH Customer:
DISPLAY Customer.Name.
FOR EACH Order OF Customer:
UPDATE Order.OrderNum Order.PromiseDate Order.OrderDate Order.ShipDate.
END.
UPDATE Customer.CreditLimit.
END.

STATUS DEFAULT "Ready" IN WINDOW hWin.
STATUS INPUT OFF IN WINDOW hWin.

/* statements/stop.txt: STOP statement */
STOP.

/* statements/stop.txt: STOP - reference snippets */
DEFINE VARIABLE ans AS LOGICAL NO-UNDO.
FOR EACH Customer:
DISPLAY Customer.CustNum Customer.Name.
UPDATE Customer.CreditLimit.
ans = FALSE.
MESSAGE "Stopping now undoes changes to this record.".
MESSAGE "Do you want to stop now?" UPDATE ans.
IF ans THEN STOP.
END.

DEFINE VARIABLE ans AS LOGICAL NO-UNDO.
FOR EACH Customer ON STOP UNDO, RETRY:
DISPLAY Customer.CustNum Customer.Name.
UPDATE Customer.CreditLimit.
ans = FALSE.
MESSAGE "Stopping now undoes changes to this record."
"Do you want to stop now?"
VIEW-AS ALERT-BOX QUESTION BUTTONS YES-NO UPDATE ans.
IF ans THEN STOP.
END.

/* statements/stream.txt: STREAM DEFINITION - Basic Syntax */
DEFINE STREAM outStream.
DEF STREAM debugStream.

/* statements/stream.txt: STREAM DEFINITION - NEW SHARED */
DEFINE NEW SHARED STREAM sShared.
DEF NEW SHARED STREAM sGlobal.

/* statements/stream.txt: STREAM DEFINITION - SHARED */
DEFINE SHARED STREAM sCust.
DEF SHARED STREAM sOrder.

/* statements/stream.txt: STREAM DEFINITION - NEW GLOBAL SHARED */
DEFINE NEW GLOBAL SHARED STREAM sGlobalShared.
DEF NEW GLOBAL SHARED STREAM sPersistent.

/* statements/stream.txt: STREAM DEFINITION - PRIVATE */
DEFINE PRIVATE STREAM privStream.
DEF PRIVATE STREAM classStream.

/* statements/stream.txt: STREAM DEFINITION - Short Names */
DEF STREAM s.
DEFINE STREAM log.
DEFINE NEW SHARED STREAM db.
DEFINE PRIVATE STREAM out.

/* statements/stream.txt: STREAM DEFINITION - reference snippet */
DEFINE VARIABLE fnr AS CHARACTER NO-UNDO FORMAT "x(12)".
DEFINE VARIABLE fne AS CHARACTER NO-UNDO FORMAT "x(12)".
DEFINE VARIABLE excount AS INTEGER NO-UNDO LABEL "Total Number of exceptions".
DEFINE NEW SHARED BUFFER xitem FOR item.
DEFINE NEW SHARED STREAM rpt.
DEFINE STREAM exceptions.
SET fnr LABEL "Enter filename for report output" SKIP(1)
fne LABEL "Enter filename for exception output"
WITH SIDE-LABELS FRAME fnames.
OUTPUT STREAM rpt TO VALUE(fnr) PAGED.
OUTPUT STREAM exceptions TO VALUE(fne) PAGED.
FOR EACH xitem:
IF on-hand < alloc THEN DO:
DISPLAY STREAM exceptions
xitem.ItemNum xitem.ItemName xitem.OnHand xitem.Allocated
WITH FRAME exitem DOWN.
excount = excount + 1.
END.
RUN r-dfstr2.p.
END.
DISPLAY STREAM exceptions SKIP(1) excount WITH FRAME exc SIDE-LABELS.
DISPLAY STREAM rpt WITH FRAME exc.
OUTPUT STREAM rpt CLOSE.
OUTPUT STREAM exceptions CLOSE.

DEFINE SHARED STREAM rpt.
DEFINE SHARED BUFFER xitem FOR Item.
DISPLAY STREAM rpt ItemNum ItemName WITH NO-LABELS NO-BOX.

/* statements/submenu.txt: SUB-MENU basic definition */
DEFINE SUB-MENU smFile
  MENU-ITEM miNew LABEL "New"
  MENU-ITEM miOpen LABEL "Open"
  MENU-ITEM miSave LABEL "Save".

/* statements/submenu.txt: SUB-MENU with nested submenu */
DEFINE SUB-MENU smMain
  MENU-ITEM miItem1 LABEL "Item 1"
  SUB-MENU smNested LABEL "More"
  RULE
  MENU-ITEM miItem2 LABEL "Item 2".

/* statements/submenu.txt: SUB-MENU private definition */
DEF PRIVATE SUB-MENU smPrivate
  MENU-ITEM mi1 LABEL "Test".

/* statements/submenu.txt: SUB-MENU with SKIP */
DEFINE SUB-MENU smWithSkip
  MENU-ITEM miTop LABEL "Top"
  SKIP
  MENU-ITEM miBottom LABEL "Bottom".

/* statements/submenu.txt: SUBMENU - WITH BACKGROUND COLORS */
DEFINE SUB-MENU smColors
  BGCOLOR 1
  FGCOLOR 15
  DCOLOR 5
  PFCOLOR 3
  MENU-ITEM miTest LABEL "Test".

/* statements/submenu.txt: SUBMENU - WITH FONT */
DEFINE SUB-MENU smFont
  FONT 2
  MENU-ITEM mi1 LABEL "Item 1".

/* statements/submenu.txt: SUBMENU - SUB-MENU-HELP */
DEFINE SUB-MENU smHelp
  SUB-MENU-HELP
  MENU-ITEM miHelp LABEL "Help".

/* statements/submenu.txt: SUBMENU - LIKE option */
DEFINE SUB-MENU smLike LIKE smOriginal.

/* statements/submenu.txt: SUBMENU - MENU-ITEM without label */
DEFINE SUB-MENU smNoLab
  MENU-ITEM mi1
  MENU-ITEM mi2
  RULE
  SKIP.

/* statements/submenu.txt: SUBMENU - MENU-ITEM WITH ACCELERATOR */
DEFINE SUB-MENU smAcc
  MENU-ITEM miSave LABEL "Save..." ACCELERATOR "Ctrl+S"
  MENU-ITEM miOpen LABEL "Open..." ACCELERATOR "Ctrl+O".

/* statements/submenu.txt: SUBMENU - SUB-MENU DISABLED */
DEFINE SUB-MENU smSub
  SUB-MENU smNested1 DISABLED
  SUB-MENU smNested2 DISABLED LABEL "Nested 2".

/* statements/submenu.txt: SUBMENU - MENU-ITEM DISABLED */
DEFINE SUB-MENU SM-ITEM-DISABLED
  MENU-ITEM mi1 DISABLED LABEL "Disabled"
  MENU-ITEM mi2 LABEL "Enabled"
  MENU-ITEM mi3 LABEL "Also Disabled" DISABLED.

/* statements/submenu.txt: SUBMENU - RULE and SKIP */
DEFINE SUB-MENU smMixed
  MENU-ITEM miTop LABEL "Top"
  RULE
  MENU-ITEM miMid1 LABEL "Middle 1"
  SKIP
  MENU-ITEM miMid2 LABEL "Middle 2"
  RULE
  MENU-ITEM miBot LABEL "Bottom".

/* statements/submenu.txt: SUBMENU - All color options */
DEFINE SUB-MENU smColors2
  BGCOLOR 2
  FGCOLOR 15
  DCOLOR 7
  PFCOLOR 4
  FONT 3
  SUB-MENU-HELP
  MENU-ITEM miItem LABEL "Item".

/* statements/submenu.txt: SUBMENU - Minimal */
DEFINE SUB-MENU s.
DEF SUB-MENU sub.

/* statements/submenu.txt: SUB-MENU - reference snippet */
DEFINE VARIABLE mywin AS HANDLE NO-UNDO.
DEFINE SUB-MENU myfile
MENU-ITEM m1 LABEL "Save"
MENU-ITEM m2 LABEL "Save As"
MENU-ITEM m3 LABEL "Exit".
DEFINE SUB-MENU myobjects
MENU-ITEM m1 LABEL "Circle"
MENU-ITEM m2 LABEL "Line"
MENU-ITEM m3 LABEL "Rectangle"
MENU-ITEM m4 LABEL "Text".
DEFINE SUB-MENU myedit
SUB-MENU myobjects LABEL "Add"
MENU-ITEM e1 LABEL "Delete"
MENU-ITEM e2 LABEL "Copy".
DEFINE MENU mybar MENUBAR
SUB-MENU myfile LABEL "File"
SUB-MENU myedit LABEL "Edit".
CREATE WINDOW mywin
ASSIGN MENUBAR = MENU mybar:HANDLE.
DEFINE BUTTON b1 LABEL "Text Mode".
DEFINE BUTTON b2 LABEL "Graphics Mode".
CURRENT-WINDOW = mywin.
FORM
b1 at X 10 Y 120
b2 at x 120 Y 120
WITH FRAME x.
ENABLE b1 b2 WITH FRAME x.
ON CHOOSE OF b1 IN FRAME x DO:
MENU-ITEM m1:SENSITIVE IN MENU myobjects = FALSE.
MENU-ITEM m2:SENSITIVE IN MENU myobjects = FALSE.
MENU-ITEM m3:SENSITIVE IN MENU myobjects = FALSE.
MENU-ITEM m4:SENSITIVE IN MENU myobjects = TRUE.
END.
ON CHOOSE OF b2 IN FRAME x DO:
MENU-ITEM m1:SENSITIVE IN MENU myobjects = TRUE.
MENU-ITEM m2:SENSITIVE IN MENU myobjects = TRUE.
MENU-ITEM m3:SENSITIVE IN MENU myobjects = TRUE.
MENU-ITEM m4:SENSITIVE IN MENU myobjects = FALSE.
END.
WAIT-FOR CHOOSE OF MENU-ITEM m3 IN MENU myfile.
DELETE WIDGET mywin.

/* statements/subscribe.txt: SUBSCRIBE statement */
SUBSCRIBE TO "MyEvent" IN hPublisher.
SUBSCRIBE "MyEvent" ANYWHERE.
SUBSCRIBE PROCEDURE hSub TO "MyEvent" IN hPub.

/* statements/subscribe.txt: SUBSCRIBE - reference snippets and variants */
DEFINE VARIABLE hPub AS HANDLE NO-UNDO.
DEFINE VARIABLE hSub1 AS HANDLE NO-UNDO.
DEFINE VARIABLE hSub2 AS HANDLE NO-UNDO.
RUN r-nepub.p PERSISTENT SET hPub.
RUN r-nesub1.p PERSISTENT SET hSub1 (hPub).
RUN r-nesub2.p PERSISTENT SET hSub2.
SUBSCRIBE PROCEDURE hSub2 TO "NewCustomer" IN hPub.

DEFINE INPUT PARAMETER hPub AS HANDLE NO-UNDO.
SUBSCRIBE TO "NewCustomer" IN hPub.

SUBSCRIBE PROCEDURE hSub1 TO cEvent IN hPub RUN-PROCEDURE "OnEvent" NO-ERROR.
SUBSCRIBE TO "spaced event" ANYWHERE RUN-PROCEDURE "spaced event".

/* statements/system-dialog.txt: SYSTEM-DIALOG */
SYSTEM-DIALOG COLOR 7 UPDATE colorSel IN WINDOW winH.
SYSTEM-DIALOG FONT fontId MAX-SIZE 14 MIN-SIZE 8 UPDATE fontSel.
SYSTEM-DIALOG FONT fontId ANSI-ONLY FIXED-ONLY IN WINDOW winH.
SYSTEM-DIALOG GET-FILE cFile FILTERS "Images" "*.png" INITIAL-FILTER "Images" MUST-EXIST TITLE "Pick".
SYSTEM-DIALOG GET-FILE cOut SAVE-AS ASK-OVERWRITE DEFAULT-EXTENSION "txt" RETURN-TO-START-DIR USE-FILENAME.
SYSTEM-DIALOG GET-DIR cDir INITIAL-DIR "C:\\tmp" TITLE "Pick Dir".
SYSTEM-DIALOG PRINTER-SETUP NUM-COPIES 2 LANDSCAPE.
SYSTEM-DIALOG PRINTER-SETUP PORTRAIT UPDATE pset IN WINDOW winH.

/* statements/system-help.txt: SYSTEM-HELP */
SYSTEM-HELP "help" NO-ERROR.

/* statements/temp-table.txt: TEMP-TABLE DEFINITION - Basic */
DEFINE TEMP-TABLE tt_ship NO-UNDO
  NAMESPACE-URI "urn:x" NAMESPACE-PREFIX "p"
  XML-NODE-NAME "node" SERIALIZE-NAME "ser"
  REFERENCE-ONLY
  LIKE base_tbl VALIDATE USE-INDEX idx_ship AS PRIMARY
  RCODE-INFORMATION
  BEFORE-TABLE bt_ship
  FIELD ship_code AS CHARACTER FORMAT "x(20)" LABEL "Code" SERIALIZE-NAME "ShipCode"
  FIELD ship_desc AS CHARACTER
  FIELD ship_type LIKE ship_code VALIDATE
  FIELD ship_qty AS INTEGER INITIAL 5
  FIELD ship_flag AS LOGICAL INITIAL TRUE
  INDEX idx_ship AS UNIQUE PRIMARY ship_code DESCENDING ship_qty.

/* statements/temp-table.txt: TEMP-TABLE DEFINITION - LIKE Variations */
DEFINE TEMP-TABLE tt_like LIKE base_tbl
  FIELD extra_col AS DECIMAL.
DEFINE TEMP-TABLE tt_seq LIKE-SEQUENTIAL base_tbl
  FIELD f1 AS INTEGER.
DEFINE TEMP-TABLE tt_idx LIKE base_tbl USE-INDEX idx1 USE-INDEX idx2 AS PRIMARY
  FIELD f1 AS INTEGER.

/* statements/temp-table.txt: TEMP-TABLE DEFINITION - FIELDS keyword variant */
DEFINE TEMP-TABLE tLine
  FIELDS t-line AS INTEGER
  FIELDS t-data AS CHARACTER.

/* statements/temp-table.txt: TEMP-TABLE DEFINITION - Shared Variations */
DEFINE NEW SHARED TEMP-TABLE tt1 NO-UNDO FIELD f1 AS INTEGER.
DEFINE NEW GLOBAL SHARED TEMP-TABLE tt2 NO-UNDO FIELD f2 AS CHARACTER.
DEFINE SHARED TEMP-TABLE tt3 NO-UNDO FIELD f3 AS INTEGER.

/* statements/temp-table.txt: TEMP-TABLE DEFINITION - Access Modifiers */
DEFINE PRIVATE TEMP-TABLE tt1 NO-UNDO FIELD f1 AS INTEGER.
DEFINE PROTECTED TEMP-TABLE tt2 NO-UNDO FIELD f2 AS CHARACTER.
DEFINE PRIVATE STATIC TEMP-TABLE tt3 NO-UNDO FIELD f3 AS LOGICAL.

/* statements/temp-table.txt: TEMP-TABLE DEFINITION - Serialization */
DEFINE SERIALIZABLE TEMP-TABLE tt1 NO-UNDO FIELD f1 AS INTEGER.
DEFINE NON-SERIALIZABLE TEMP-TABLE tt2 NO-UNDO FIELD f2 AS CHARACTER.
DEFINE PRIVATE SERIALIZABLE TEMP-TABLE tt3 NO-UNDO FIELD f3 AS LOGICAL.

/* statements/temp-table.txt: TEMP-TABLE DEFINITION - Field Data Types */
DEFINE TEMP-TABLE tt NO-UNDO
  FIELD f1 AS CHARACTER
  FIELD f2 AS COM-HANDLE
  FIELD f3 AS DATE
  FIELD f4 AS DATETIME
  FIELD f5 AS DATETIME-TZ
  FIELD f6 AS DECIMAL
  FIELD f7 AS HANDLE
  FIELD f8 AS INT64
  FIELD f9 AS INTEGER
  FIELD f10 AS LOGICAL
  FIELD f11 AS RAW
  FIELD f12 AS RECID
  FIELD f13 AS ROWID.

/* statements/temp-table.txt: TEMP-TABLE FIELD with INIT short for INITIAL */
DEFINE TEMP-TABLE ttSample NO-UNDO
    FIELD flagA AS LOGICAL   INIT NO
    FIELD flagB AS CHARACTER INIT NO.

/* statements/temp-table.txt: TEMP-TABLE DEFINITION - Field Options */
DEFINE TEMP-TABLE tt NO-UNDO
  FIELD f1 AS CHARACTER EXTENT 10
  FIELD f2 AS DECIMAL DECIMALS 2 INITIAL 10.50
  FIELD f3 AS INTEGER BGCOLOR 15 FGCOLOR 1 FONT 2
  FIELD f9 AS CHARACTER DCOLOR 3 PFCOLOR 4
  FIELD f4 AS CHARACTER HELP "Help text"
  FIELD f5 AS LOGICAL SERIALIZE-HIDDEN
  FIELD f6 AS CHARACTER SERIALIZE-NAME "SerName"
  FIELD f7 AS CHARACTER COLUMN-LABEL "Label"
  FIELD f8 AS CHARACTER XML-DATA-TYPE "string"
  FIELD f10 AS CHARACTER XML-NODE-TYPE "ATTRIBUTE"
  FIELD f11 AS CHARACTER XML-NODE-NAME "XmlName"
  FIELD f12 AS LOGICAL NOT CASE-SENSITIVE.

/* statements/temp-table.txt: TEMP-TABLE DEFINITION - Index Variations */
DEFINE TEMP-TABLE tt NO-UNDO
  FIELD f1 AS INTEGER
  FIELD f2 AS CHARACTER
  FIELD f3 AS DECIMAL
  INDEX idx1 f1
  INDEX idx2 AS UNIQUE f2 ASCENDING
  INDEX idx3 IS PRIMARY f3 DESCENDING
  INDEX idx4 AS UNIQUE PRIMARY WORD-INDEX f1 f2.

/* statements/temp-table.txt: TEMP-TABLE - reference snippet */
DEFINE TEMP-TABLE temp-item
FIELD cat-page LIKE Item.CatPage
FIELD inventory LIKE Item.Price LABEL "Inventory Value"
INDEX cat-page IS PRIMARY cat-page ASCENDING
INDEX inventory-value inventory DESCENDING.
DEFINE VARIABLE cutoff NO-UNDO LIKE item.price.
DEFINE VARIABLE inv-value NO-UNDO LIKE item.price.
DEFINE VARIABLE report-type AS INTEGER NO-UNDO INITIAL 1.
DEFINE BUTTON ok-butt LABEL "OK" AUTO-GO.
DEFINE BUTTON cancel-butt LABEL "CANCEL" AUTO-ENDKEY.
FORM
cutoff LABEL "Inventory Lower Cutoff for each Catalog Page"
AT ROW 1.25 COLUMN 2
report-type LABEL "Report Sorted ..." AT ROW 2.25 COLUMN 2
VIEW-AS RADIO-SET RADIO-BUTTONS
"By Catalog Page",
1,
"By Inventory Value", 2 SKIP
ok-butt cancel-butt
WITH FRAME select-frame SIDE-LABELS WIDTH 70
TITLE "Specify Report ..." VIEW-AS DIALOG-BOX.
FOR EACH Item BREAK BY Item.CatPage:
ACCUMULATE Item.Price * Item.OnHand (SUB-TOTAL BY Item.CatPage).
IF LAST-OF(Item.CatPage) THEN DO:
inv-value = ACCUM SUB-TOTAL BY Item.CatPage (Item.Price * Item.OnHand).
CREATE temp-item.
temp-item.cat-page = Item.CatPage.
inventory = inv-value.
END.
END.
ON CHOOSE OF ok-butt DO:
HIDE FRAME select-frame.
IF report-type = 1 THEN
FOR EACH temp-item USE-INDEX cat-page WITH FRAME rpt1-frame:
IF inventory >= cutoff THEN
DISPLAY temp-item.cat-page inventory.
END.
ELSE
FOR EACH temp-item USE-INDEX inventory-value WITH FRAME rpt2-frame:
IF inventory >= cutoff THEN
DISPLAY temp-item.cat-page inventory.
END.
VIEW FRAME select-frame.
END.
ENABLE ALL WITH FRAME select-frame.
WAIT-FOR CHOOSE OF cancel-butt OR WINDOW-CLOSE OF CURRENT-WINDOW.

/* statements/terminal.txt: TERMINAL statement */
TERMINAL = "vt100".
TERMINAL = cTermType.

/* statements/terminal.txt: TERMINAL statement with various expression types */
TERMINAL = "vt100".
TERMINAL = cTermType.
TERMINAL = "ansi".
TERMINAL = "monochrome".
TERMINAL = "CO80".

/* statements/terminal.txt: TERMINAL - reference snippet */
FOR EACH Customer NO-LOCK:
DISPLAY Customer.
END.
TERMINAL = "wy60w".
OUTPUT TO TERMINAL PAGED.
FOR EACH Customer NO-LOCK:
DISPLAY Customer WITH WIDTH 132.
END.
OUTPUT CLOSE.
TERMINAL = "wy60".
DISPLAY "Back to 80 columns." WITH CENTERED.

/* statements/transaction-mode.txt: TRANSACTION-MODE */
TRANSACTION-MODE AUTOMATIC.
TRANSACTION-MODE AUTOMATIC CHAINED.

/* statements/transaction-mode.txt: TRANSACTION-MODE - CHAINED variant */
TRANSACTION-MODE AUTOMATIC CHAINED.

/* statements/trigger-procedure.txt: TRIGGER PROCEDURE */
TRIGGER PROCEDURE FOR CREATE OF Customer.
TRIGGER PROCEDURE FOR WRITE OF Order.
TRIGGER PROCEDURE FOR WRITE OF Order NEW BUFFER bNew OLD BUFFER bOld.
TRIGGER PROCEDURE FOR ASSIGN NEW VALUE vNew AS CHARACTER.
TRIGGER PROCEDURE FOR ASSIGN NEW vNew AS CHARACTER.
TRIGGER PROCEDURE FOR ASSIGN OF Customer.Name.
TRIGGER PROCEDURE FOR ASSIGN NEW VALUE vLike LIKE Customer.Name.
TRIGGER PROCEDURE FOR ASSIGN NEW VALUE v1 AS CHARACTER FORMAT "x" LABEL "lbl" NO-UNDO OLD VALUE v2 AS CHARACTER COLUMN-LABEL "c".
TRIGGER PROCEDURE FOR REPLICATION-CREATE OF Customer.

/* statements/underline.txt: UNDERLINE */
UNDERLINE field1.
UNDERLINE field1 field2 field3.
UNDERLINE STREAM s1 field1.
UNDERLINE field1 WITH FRAME f1.

/* statements/underline.txt: UNDERLINE - reference snippet */
FOR EACH Customer NO-LOCK BREAK BY Customer.State WITH USE-TEXT:
DISPLAY Customer.State Customer.CustNum Customer.Name.
IF LAST-OF(Customer.State) THEN UNDERLINE Customer.State.
END.

UNDERLINE STREAM-HANDLE hS Customer.Name WITH FRAME f1.

/* statements/undo.txt: UNDO */
UNDO, THROW errObj.
UNDO, LEAVE.
UNDO, RETRY.
UNDO, RETURN "done".
UNDO, RETURN ERROR "bad".
UNDO, RETURN NO-APPLY.
UNDO.

/* statements/undo.txt: UNDO - reference snippet and variants */
FIND Customer 1000 NO-ERROR.
IF ERROR-STATUS:ERROR THEN
UNDO, THROW NEW Progress.Lang.AppError("Can't find this customer", 550).
MESSAGE Customer.CustNum.
CATCH eAppError AS Progress.Lang.AppError:
MESSAGE eAppError:GetMessage(1) eAppError:GetMessageNum(1).
END CATCH.

main: REPEAT:
DO TRANSACTION:
UNDO, NEXT main.
END.
END.

UNDO, LEAVE main.
UNDO, RETURN ERROR errObj.

/* statements/undo.txt: UNDO - RETURN ERROR bare (no value) */
UNDO, RETURN ERROR.

/* statements/unix.txt: UNIX statement */
UNIX.
UNIX SILENT.
UNIX VALUE("ls -la").

/* statements/unix.txt: UNIX - reference snippets */
IF OPSYS = "UNIX" THEN UNIX ls.
ELSE IF OPSYS = "WIN32" THEN DOS dir.
ELSE DISPLAY OPSYS "is an unsupported operating system".

DEFINE VARIABLE proc AS CHARACTER NO-UNDO FORMAT "x(40)".
REPEAT:
DISPLAY "Enter L to list your files"
WITH ROW 5 CENTERED FRAME a.
SET proc LABEL "Enter a valid Procedure Name to run"
WITH ROW 9 CENTERED FRAME b.
IF proc = "L" THEN
IF OPSYS = "UNIX" THEN UNIX ls.
ELSE IF OPSYS = "WIN32" then DOS dir.
ELSE display "Operating system" OPSYS "is not supported".
ELSE DO:
HIDE FRAME a.
HIDE FRAME b.
RUN VALUE(proc).
END.
END.

UNIX VALUE("cp usr/myfile.").

/* statements/unload.txt: UNLOAD statement */
UNLOAD "myfile.r".
UNLOAD cFile.

/* statements/unload.txt: UNLOAD statement with NO-ERROR */
UNLOAD "myfile.r" NO-ERROR.
UNLOAD cFile NO-ERROR.

/* statements/unload.txt: UNLOAD statement with different expression types */
UNLOAD "path/to/file.r".
UNLOAD cFilePath.
UNLOAD cPathVariable + ".r".

/* statements/unload.txt: UNLOAD - VALUE expression */
UNLOAD VALUE(cFile) NO-ERROR.

/* statements/unsubscribe.txt: UNSUBSCRIBE statement */
UNSUBSCRIBE TO "MyEvent".
UNSUBSCRIBE ALL.
UNSUBSCRIBE TO "MyEvent" IN hPub.

/* statements/unsubscribe.txt: UNSUBSCRIBE - reference snippets and variants */
PROCEDURE NewCustomer:
DEFINE INPUT PARAMETER name AS CHARACTER NO-UNDO.
MESSAGE "Subscriber 2 received event NewCustomer concerning" name
VIEW-AS ALERT-BOX.
UNSUBSCRIBE TO ALL.
END.

UNSUBSCRIBE PROCEDURE hSub TO "NewCustomer" IN hPub.
UNSUBSCRIBE PROCEDURE hSub TO cEvent.
UNSUBSCRIBE ALL IN hPub.

/* statements/up.txt: UP statement */
UP.
UP 2.
UP 1 WITH FRAME myframe.
UP STREAM sOut 2.

/* statements/up.txt: UP - reference snippet and variants */
FOR EACH Customer:
UP 2.
DISPLAY Customer.CustNum Customer.Name Customer.City.
END.

UP STREAM-HANDLE hS 3 WITH FRAME f1.

/* statements/update.txt: UPDATE */
UPDATE field1.
UPDATE field1 field2 field3.
UPDATE field1 WHEN x > 5.
UPDATE UNLESS-HIDDEN field1.
UPDATE field1 WITH FRAME f1.
UPDATE field1 WITH FRAME f1 NO-ERROR.
UPDATE tng_dostawa[1] = so_ship tng_nabyw[1] = so_cust.
UPDATE field1 GO-ON(f1 f2).

/* statements/update.txt: UPDATE GO-ON with comma-separated strings */
UPDATE field1 GO-ON("F5","CTRL-D").

/* statements/update.txt: UPDATE with format, text, constants, and editing */
UPDATE field1 FORMAT "x(10)" WHEN ok
  TEXT(field2 FORMAT "x(5)")
  "CONST" AT 5
  field3 = 10
  SKIP
  EDITING:
    READKEY.
  END.

/* statements/update.txt: UPDATE record with EXCEPT and constant TO */
UPDATE Customer EXCEPT Comments PrivateNotes WITH FRAME fCust NO-ERROR.
UPDATE "Header" TO 30 Customer.Name.

/* statements/update.txt: UPDATE - reference snippets */
FOR EACH Customer:
UPDATE Customer.Name Customer.Address Customer.City Customer.State
Customer.Country.
END.

FOR EACH Customer:
UPDATE Customer.Name
Customer.CreditLimit VALIDATE(Customer.CreditLimit < 500000, "Too high")
HELP "Enter CreditLimit < 500000".
FOR EACH Order OF Customer:
DISPLAY Order.OrderNum.
UPDATE Order.PromiseDate Order.ShipDate VALIDATE(Order.ShipDate > TODAY,
"Ship date must be later than today").
END.
END.

REPEAT:
PROMPT-FOR Customer.CustNum.
FIND Customer USING Customer.CustNum.
UPDATE Customer.Name Customer.Address Customer.City Customer.State
Customer.Country WITH 1 COLUMN 1 DOWN.
END.

DEFINE VARIABLE s-com AS CHARACTER NO-UNDO FORMAT "x(40)" EXTENT 5.
FORM
"Shipped
:" order.ship-date AT 13 SKIP
"Misc Info :" order.instructions AT 13 SKIP(1)
"Order Comments :" s-com AT 1
WITH FRAME o-com CENTERED NO-LABELS TITLE "Shipping Information".
FOR EACH Customer NO-LOCK, EACH Order OF Customer:
DISPLAY Customer.CustNum Customer.Name Order.OrderNum Order.OrderDate
Order.PromiseDate WITH FRAME order-hdr CENTERED.
UPDATE Order.ShipDate Order.Instructions TEXT(s-com) WITH FRAME o-com.
s-com = "".
END.

UPDATE Customer EXCEPT Comments WITH FRAME fCust.
UPDATE field1 SPACE(2) SKIP(1) ^.

/* statements/update.txt: UPDATE - multiple fields with frame_phrase */
UPDATE field1 field2 WITH FRAME f1.

/* statements/use.txt: USE */
USE "production".
USE cEnvironment.
USE "testing" NO-ERROR.

/* statements/use.txt: USE - VALUE expression */
USE VALUE(cEnv) NO-ERROR.

/* statements/use.txt: USE - reference snippet */
DEFINE VARIABLE w1 AS CHARACTER NO-UNDO VIEW-AS TEXT FONT 0
FORMAT "x(34)" INITIAL "This is font 0 in the first window".
DEFINE VARIABLE w2 AS CHARACTER NO-UNDO VIEW-AS TEXT FONT 0
FORMAT "x(35)" INITIAL "This is font 0 in the second window".
DEFINE VARIABLE new_win AS HANDLE NO-UNDO.
LOAD "env1".
LOAD "env2".
USE "env1".
DISPLAY w1 WITH NO-LABELS WITH FRAME a.
PAUSE.
USE "env2".
CREATE WINDOW new_win.
CURRENT-WINDOW = new_win.
DISPLAY w2 in WINDOW new_win WITH NO-LABELS WITH FRAME b.
PAUSE.
DELETE WIDGET new_win.

/* statements/using.txt: USING */
USING Progress.Collections.*.
USING Acme.BusObjs.Customer.

/* statements/using.txt: USING with multiple types */
USING Domains.Vacation.Vacation, Progress.Json.ObjectModel.JsonObject.

/* statements/using.txt: USING with different patterns */
USING Progress.Collections.*.
USING Progress.Collections.List.
USING System.Windows.Forms.*.
USING Acme.BusObjs.*.

/* statements/using.txt: USING - reference snippets and FROM options */
USING Acme.BusObjs.*.
DEFINE VARIABLE CustObj AS CLASS Customer.
DEFINE VARIABLE CustObj2 AS CLASS Acme.BusObjs.Customer.

USING Acme.BusObjs.Customer.
DEFINE VARIABLE CustObj AS CLASS Customer.
DEFINE VARIABLE CustObj2 AS CLASS Acme.BusObjs.Customer.

USING System.Windows.Forms.* FROM ASSEMBLY.
DEFINE VARIABLE rControl AS CLASS Control.
DEFINE VARIABLE rCollection AS CLASS Control+ControlCollection.

USING Classes.Inventory.*.
DEFINE VARIABLE clRef AS CLASS Shipping.
clRef = NEW Shipping().

USING System.Windows.Forms.*.
USING System.Collections.Generic.List<Button>.
USING System.Collections.ObjectModel.*.
DEFINE VARIABLE ButtonList AS CLASS List<Button> NO-UNDO.
DEFINE VARIABLE intColl AS CLASS Collection<INTEGER> NO-UNDO.

USING Acme.BusObjs.* FROM PROPATH.

/* statements/validate.txt: VALIDATE statement */
VALIDATE Customer.
VALIDATE Item NO-ERROR.
VALIDATE db1.Customer.

/* statements/validate.txt: VALIDATE - reference snippet */
REPEAT FOR Item:
PROMPT-FOR Item.ItemNum.
FIND Item USING Item.ItemNum NO-ERROR.
IF NOT AVAILABLE Item THEN DO:
CREATE iIem.
ASSIGN Item.ItemNum.
UPDATE Item.ItemName Item.Price.
VALIDATE Item.
END.
ELSE
DISPLAY Item.ItemName Item.Price.
END.

VALIDATE sports.Item NO-ERROR.

/* statements/value-assignments.txt: VALUE ASSIGNMENTS */
CURRENT-LANGUAGE = "en".
CURRENT-VALUE(seq1, "db", 1) = 2.
DYNAMIC-CURRENT-VALUE("seq", "db", 1) = 2.
DYNAMIC-PROPERTY(hObj, "Prop") = 5 NO-ERROR.
FRAME-VALUE = "x" NO-ERROR.
ENTRY(1, "a,b", ",") = "c".
LENGTH(name) = 5.
RAW(field1, 2, 3) = "x".
SUBSTRING("abc", 2, 1) = "d" NO-ERROR.

/* statements/var.txt: VAR statement */
/* Four character variables with default initial values */
VAR CHAR s1, s2, s3, s4.

/* Three integer variables. */
/* z’s initial value is 3. x and y default to 0 */
VAR INT x, y, z = 3.

/* Three date variables */
VAR DATE d1, d2 = 1/1/2020, d3 = TODAY.

/* Date variables with the protected access mode */
VAR PROTECTED DATE d1, d2 = 1/1/2020.

/* Static variable */
VAR STATIC INT sVar.

/* Serializable instance variable */
VAR SERIALIZABLE INT sVar2.

/* Three arrays of size 3 */
/* x's third element defaults to 2 (the previous element) */
/* y's elements default to 0 */
VAR INT[3] x = [1, 2], y, z = [100, 200, 300].

/* Two indeterminate arrays. x has no size. y has a size of 3. */
VAR INT[] x, y = [1,2,3].

/* .NET generic object */
VAR "System.Collections.Generic.List<char>" cList.

/* Three object variables */
VAR mypackage.subdir.myclass myobj1, myobj2, myobj3.

/* Object variable with the optional CLASS keyword */
VAR CLASS mypackage.subdir.myclass myobj1.

/* Object array of size 2 */
VAR foo[2] classArray.

/* Instantiated object variables */
VAR myclass myobj = NEW myclass().
VAR myclass myobj = NEW myclass("Progress", 2020,?).

/* Multiple instantiated object variables */
VAR myclass myobj1 = NEW myclass("MA"),
            myobj2 = NEW myclass("VT"),
            myobj3 = NEW myclass("NH").

/* Instantiated base class type */
VAR baseclass myobj1 = NEW derivedAClass(), myobj2 = NEW derivedBClass("foo").

/* Instantiated interface type */
VAR IMaps myobj1 = NEW GoogleMap("CANADA"), myobj2 = NEW OpenStreetMap("USA").

/* Instantiated and initialized determinate array object variable */
VAR StateClass[2] objArrayA = [NEW StateClass("MA"), NEW StateClass("NH")].

/* Instantiated and initialized indeterminate array object variable */
VAR StateClass[] objArrayB = [NEW StateClass("MA"), NEW StateClass("NH")].

/* Integer variables initialized using expressions */
VAR INT x = a + b , y = a - b, z = x - y.

/* Indeterminate integer array initialized using expressions */
VAR INT[ ] x = [funct( ), a + b].

/* Generic type */
var List<Ant> ListOfAnts.

/* statements/var.txt: VAR statement - additional access/serialization variants */
VAR PACKAGE-PRIVATE INT p1.
VAR PACKAGE-PROTECTED INT p2.
VAR NON-SERIALIZABLE INT n1.
VAR CLASS mypackage.subdir.myclass myobj4.

/* statements/variable.txt: VARIABLE DEFINITION - Basic Types */
DEFINE VARIABLE count& AS INTEGER.
DEF VAR foo AS Some.Type NO-UNDO.
DEFINE VARIABLE list AS List<INTEGER>.
DEFINE VARIABLE cName AS CHARACTER EXTENT 4 INITIAL ["a","b","c","d"].
DEFINE NEW GLOBAL SHARED VARIABLE gValue AS INTEGER NO-UNDO.
DEFINE PRIVATE STATIC SERIALIZABLE VARIABLE cust AS CLASS Customer NO-UNDO.

/* statements/variable.txt: VARIABLE DEFINITION - Identifier with percent (legacy naming) */
DEFINE VARIABLE P%RowId AS ROWID NO-UNDO.
DEFINE VARIABLE P%Rate  AS DECIMAL DECIMALS 8 NO-UNDO.

/* statements/variable.txt: VARIABLE DEFINITION - LIKE and Display Options */
DEFINE VARIABLE likeVar LIKE Customer.Name LABEL "Name" COLUMN-LABEL "Cust Name" FORMAT "x(20)".
DEFINE VARIABLE flags AS LOGICAL NOT CASE-SENSITIVE.
DEFINE VARIABLE fillIn AS CHARACTER DROP-TARGET.
DEFINE VARIABLE cSer AS CHARACTER SERIALIZE-NAME "ser-name".
DEFINE VARIABLE cView AS CHARACTER VIEW-AS FILL-IN.

/* statements/variable.txt: VARIABLE DEFINITION - Color and Visual Options */
DEFINE VARIABLE v1 AS CHARACTER BGCOLOR 15 FGCOLOR 1.
DEFINE VARIABLE v2 AS DECIMAL DCOLOR 7 PFCOLOR 8.
DEFINE VARIABLE v3 AS INTEGER FONT 2 MOUSE-POINTER 15.
DEFINE VARIABLE v4 AS CHARACTER CONTEXT-HELP-ID 123.

/* statements/variable.txt: VARIABLE DEFINITION - DECIMALS Option */
DEFINE VARIABLE price AS DECIMAL DECIMALS 2 NO-UNDO.
DEFINE VARIABLE rate AS DECIMAL DECIMALS 4 INITIAL 0.0525.

/* statements/variable.txt: VARIABLE DEFINITION - EXTENT Variations */
DEFINE VARIABLE arr1 AS INTEGER EXTENT.
DEFINE VARIABLE arr2 AS CHARACTER EXTENT 10 NO-UNDO.
DEFINE VARIABLE arr3 AS DECIMAL EXTENT {&MAX_SIZE}.
DEFINE VARIABLE arr4 EXTENT 7 LIKE ad_name NO-UNDO.

/* statements/variable.txt: VARIABLE DEFINITION - INITIAL with Different Types */
DEFINE VARIABLE iNum AS INTEGER INITIAL 100.
DEFINE VARIABLE dNum AS DECIMAL INITIAL 99.99.
DEFINE VARIABLE cStr AS CHARACTER INITIAL "test".
DEFINE VARIABLE lFlag AS LOGICAL INITIAL TRUE.
DEFINE VARIABLE dtDate AS DATE INITIAL TODAY.

/* statements/variable.txt: VARIABLE DEFINITION - Shared Variations */
DEFINE NEW SHARED VARIABLE v1 AS INTEGER NO-UNDO.
DEFINE NEW GLOBAL SHARED VARIABLE v2 AS CHARACTER NO-UNDO.
DEFINE SHARED VARIABLE v3 AS LOGICAL NO-UNDO.

/* statements/variable.txt: VARIABLE DEFINITION - Access Modifiers */
DEFINE PRIVATE VARIABLE v1 AS INTEGER NO-UNDO.
DEFINE PROTECTED VARIABLE v2 AS CHARACTER NO-UNDO.
DEFINE PUBLIC VARIABLE v3 AS LOGICAL NO-UNDO.
DEFINE PACKAGE-PRIVATE VARIABLE v4 AS DECIMAL NO-UNDO.
DEFINE PACKAGE-PROTECTED VARIABLE v5 AS INTEGER NO-UNDO.

/* statements/variable.txt: VARIABLE DEFINITION - Serialization Modifiers */
DEFINE PUBLIC SERIALIZABLE VARIABLE v1 AS INTEGER NO-UNDO.
DEFINE PRIVATE NON-SERIALIZABLE VARIABLE v2 AS CHARACTER NO-UNDO.
DEFINE PROTECTED STATIC SERIALIZABLE VARIABLE v3 AS LOGICAL NO-UNDO.

/* statements/variable.txt: VARIABLE DEFINITION - Primitive Types */
DEFINE VARIABLE v1 AS CHARACTER NO-UNDO.
DEFINE VARIABLE v2 AS COM-HANDLE NO-UNDO.
DEFINE VARIABLE v3 AS DATE NO-UNDO.
DEFINE VARIABLE v4 AS DATETIME NO-UNDO.
DEFINE VARIABLE v5 AS DATETIME-TZ NO-UNDO.
DEFINE VARIABLE v6 AS DECIMAL NO-UNDO.
DEFINE VARIABLE v7 AS HANDLE NO-UNDO.
DEFINE VARIABLE v8 AS INT64 NO-UNDO.
DEFINE VARIABLE v9 AS INTEGER NO-UNDO.
DEFINE VARIABLE v10 AS LOGICAL NO-UNDO.
DEFINE VARIABLE v11 AS LONGCHAR NO-UNDO.
DEFINE VARIABLE v12 AS MEMPTR NO-UNDO.
DEFINE VARIABLE v13 AS RAW NO-UNDO.
DEFINE VARIABLE v14 AS RECID NO-UNDO.
DEFINE VARIABLE v15 AS ROWID NO-UNDO.

/* statements/variable.txt: VARIABLE DEFINITION - Trigger Phrase */
DEFINE VARIABLE vTrigger AS CHARACTER ON trigger1.
DEFINE VARIABLE vEvent AS INTEGER ON clickHandler NO-UNDO.

/* statements/variable.txt: VARIABLE DEFINITION - reference snippets 1 */
DEFINE NEW SHARED VARIABLE del AS LOGICAL NO-UNDO.
DEFINE NEW SHARED VARIABLE nrecs AS INTEGER NO-UNDO.
MESSAGE "Do you want to delete the orders being printed (y/n)?" UPDATE del.
RUN r-dfvar2.p.
IF del THEN
MESSAGE nrecs "orders have been shipped and were deleted".
ELSE
MESSAGE nrecs "orders have been shipped".

DEFINE SHARED VARIABLE del AS LOGICAL NO-UNDO.
DEFINE SHARED VARIABLE nrecs AS INTEGER NO-UNDO.
OUTPUT TO PRINTER.
FOR EACH Order WHERE Order.ShipDate <> ?:
nrecs = nrecs + 1.
FOR EACH OrderLine OF Order:
DISPLAY OrderLine.OrderNum OrderLine.LineNum OrderLine.Qty
OrderLine.Price.
IF del THEN DELETE OrderLine.
END.
IF del THEN DELETE Order.
END.
OUTPUT CLOSE.

DEFINE NEW GLOBAL SHARED VARIABLE first-time AS LOGICAL NO-UNDO INITIAL TRUE.
DEFINE VARIABLE selection AS INTEGER NO-UNDO FORMAT "9" LABEL "Selection".
IF first-time THEN DO:
RUN r-init.p.
first-time = FALSE.
END.
FORM
"
MAIN MENU
" SKIP(1)
"1 - Accounts Payable
" SKIP
"2 - Accounts Receivable"
WITH CENTERED ROW 5 FRAME menu.
REPEAT:
VIEW FRAME menu.
UPDATE selection AUTO-RETURN WITH FRAME sel CENTERED ROW 12 SIDE-LABELS.
IF selection = 1 THEN DO:
HIDE FRAME menu.
HIDE FRAME sel.
RUN apmenu.p.
END.
ELSE IF selection = 2 THEN DO:
HIDE FRAME menu.
HIDE FRAME sel.
RUN armenu.p.
END.
ELSE DO:
MESSAGE "Invalid selection. Try again".
UNDO, RETRY.
END.
END.

/* statements/variable.txt: VARIABLE DEFINITION - reference snippets 2 */
DEFINE VARIABLE dow AS CHARACTER NO-UNDO FORMAT "x(9)" EXTENT 7
INITIAL ["Sunday", "Monday", "Tuesday", "Wednesday",
"Thursday", "Friday", "Saturday"].
DEFINE VARIABLE dob AS DATE NO-UNDO INITIAL TODAY.
REPEAT WITH SIDE-LABELS 1 DOWN CENTERED ROW 10 TITLE "Date of Birth":
DISPLAY SKIP(1).
UPDATE dob LABEL "Enter date of birth".
DISPLAY dow[WEEKDAY(dob)] LABEL "It was a".
END.

DEFINE VARIABLE ix AS INTEGER NO-UNDO.
DEFINE VARIABLE clubs AS CHARACTER NO-UNDO
VIEW-AS SELECTION-LIST SIZE 20 BY 5 MULTIPLE SCROLLBAR-VERTICAL NO-DRAG
LIST-ITEMS "One Iron", "Two Iron", "Three Iron", "Four Iron",
"Five Iron", "Six Iron", "Seven Iron", "Eight Iron",
"Nine Iron", "Pitching Wedge"
LABEL "Golf Clubs Available"
TRIGGERS:
ON GO DO:
IF SELF:SCREEN-VALUE <> "" THEN
DO ix = 1 TO NUM-ENTRIES(SELF:SCREEN-VALUE) :
DISPLAY ENTRY(ix, SELF:SCREEN-VALUE) FORMAT "X(16)"
WITH FRAME clubs-sel CENTERED
NUM-ENTRIES(SELF:SCREEN-VALUE) + 1 DOWN
TITLE "Clubs Selected" USE-TEXT.
DOWN 1 WITH FRAME clubs-sel.
END.
END.
END TRIGGERS.
ENABLE clubs WITH FRAME get-info TITLE "Select the Desired Club(s)".
WAIT-FOR WINDOW-CLOSE OF CURRENT-WINDOW.

DEFINE VARIABLE credit-percent AS INTEGER NO-UNDO
COLUMN-LABEL "Enter
!percentage!increase ".

FOR EACH Customer:
  DISPLAY Customer.Name Customer.CreditLimit.
  SET credit-percent.
  Customer.CreditLimit = (Customer.CreditLimit * (credit-percent / 100)) + Customer.CreditLimit.

  DISPLAY Customer.CreditLimit @ new-credit LIKE Customer.CreditLimit
    LABEL "New max cred".
END.

/* statements/variable.txt: VARIABLE - FORMAT abbreviation */
DEF VAR l_linii AS INTEGER FORMA ">>9".

/* statements/variable.txt: VARIABLE DEFINITION - LIKE with subscript */
DEFINE VARIABLE x NO-UNDO LIKE Customer.CreditLimit[1].
DEFINE VARIABLE y EXTENT 3 LIKE ttRecord.fieldArr[2] NO-UNDO.

/* statements/view.txt: VIEW statement */
VIEW.
VIEW FRAME myframe.
VIEW STREAM sOut FRAME myframe.

/* statements/view.txt: VIEW - reference snippet and variants */
OUTPUT TO slsrep PAGED PAGE-SIZE 10.
FOR EACH SalesRep NO-LOCK:
PAGE.
FORM HEADER "Sales rep report" "Page" AT 60 PAGE-NUMBER FORMAT ">>>9".
DISPLAY SKIP(1) SalesRep.SalesRep SalesRep.RepName SalesRep.Region
WITH NO-LABELS.
FORM HEADER "Sales rep report" SalesRep.SalesRep "(continued)"
"Page" AT 60 PAGE-NUMBER FORMAT ">>>9" SKIP(1)
WITH FRAME hdr2 PAGE-TOP.
VIEW FRAME hdr2.
FOR EACH Customer OF SalesRep NO-LOCK:
DISPLAY Customer.CustNum Customer.Name Customer.Address Customer.City
Customer.State.
END.
END.

VIEW FRAME f1 IN WINDOW w1.
VIEW STREAM-HANDLE hS FRAME f1.

/* statements/wait-for.txt: WAIT-FOR */
WAIT-FOR READ-RESPONSE OF hSocket PAUSE 1.
WAIT-FOR WINDOW-CLOSE OF CURRENT-WINDOW OR READ-RESPONSE OF hSocket FOCUS hSocket PAUSE 5.

/* statements/wait-for.txt: WAIT-FOR with string event and focus/pause */
WAIT-FOR WINDOW-CLOSE OF CURRENT-WINDOW OR "F6" OF b1 FOCUS b1 PAUSE 60.

/* statements/wait-for.txt: WAIT-FOR - reference snippets */
DEFINE BUTTON more-button LABEL "MORE".
DEFINE BUTTON next-button LABEL "NEXT".
FORM Customer.CustNum Customer.Name more-button next-button
WITH FRAME brief.
FORM Customer EXCEPT Customer.CustNum Customer.Name
WITH FRAME full.
ON CHOOSE OF more-button
DISPLAY Customer EXCEPT Customer.CustNum Customer.Name WITH FRAME full.
ON CHOOSE OF next-button DO:
HIDE FRAME full.
FIND NEXT Customer NO-LOCK NO-ERROR.
IF AVAILABLE Customer THEN
DISPLAY Customer.CustNum Customer.Name WITH FRAME brief.
END.
FIND FIRST Customer NO-LOCK.
DISPLAY Customer.CustNum Customer.Name WITH FRAME brief.
ENABLE more-button next-button WITH FRAME brief.
WAIT-FOR WINDOW-CLOSE OF CURRENT-WINDOW FOCUS more-button.

DEFINE VARIABLE jump-ahead AS LOGICAL NO-UNDO INITIAL TRUE.
DEFINE BUTTON more-button LABEL "MORE".
DEFINE BUTTON next-button LABEL "NEXT".
FORM Customer.CustNum Customer.Name more-button next-button
WITH FRAME brief.
FORM Customer EXCEPT Customer.CustNum Customer.Name
WITH FRAME full.
ON CHOOSE OF more-button DO:
DISPLAY Customer EXCEPT Customer.CustNum Customer.Name WITH FRAME full.
jump-ahead = FALSE.
END.
ON CHOOSE OF next-button DO:
jump-ahead = TRUE.
END.
ON WINDOW-CLOSE OF CURRENT-WINDOW DO:
QUIT.
END.
ENABLE more-button next-button WITH FRAME brief.
DO WHILE TRUE:
IF jump-ahead THEN
RUN next-cust.
WAIT-FOR WINDOW-CLOSE OF CURRENT-WINDOW OR CHOOSE OF next-button
FOCUS more-button PAUSE 3.
END.
PROCEDURE next-cust:
HIDE FRAME full.
FIND NEXT Customer NO-ERROR.
IF AVAILABLE Customer THEN
DISPLAY Customer.CustNum Customer.Name WITH FRAME brief.
END.

WAIT-FOR PROCEDURE-COMPLETE OF hRequest.

/* statements/work-table.txt: WORK-TABLE BASIC DEFINITION */
DEFINE WORK-TABLE wtCustomer NO-UNDO
  FIELD custNum AS INTEGER
  FIELD custName AS CHARACTER.

/* statements/work-table.txt: WORK-TABLE DEFINITION - LIKE Phrase */
DEFINE WORK-TABLE wtLike LIKE Customer.
DEFINE WORK-TABLE wtOrder LIKE Sales.Order NO-UNDO.

/* statements/work-table.txt: WORK-TABLE DEFINITION - Qualified LIKE */
DEFINE WORK-TABLE wtQual LIKE Sales.Order NO-UNDO.
DEF WORK-TABLE wtFull LIKE Database.Schema.Table.

/* statements/work-table.txt: WORK-TABLE DEFINITION - Field Options */
DEFINE WORK-TABLE wtOpt NO-UNDO
  FIELD code AS CHARACTER FORMAT "x(10)" LABEL "Code"
  FIELD value AS DECIMAL DECIMALS 2 INITIAL 0.

/* statements/work-table.txt: WORK-TABLE DEFINITION - WITH Index */
DEFINE WORK-TABLE wtIdx NO-UNDO
  FIELD id AS INTEGER
  FIELD name AS CHARACTER
  INDEX idx AS PRIMARY id.

/* statements/work-table.txt: WORK-TABLE DEFINITION - Minimal */
DEFINE WORK-TABLE w FIELD f AS INTEGER.
DEF WORK-TABLE wt FIELD x AS CHARACTER.

/* statements/work-table.txt: WORK-TABLE DEFINITION - EXTENT before LIKE */
DEFINE WORK-TABLE wtExt FIELD tng_nabyw EXTENT 7 LIKE ad_name.

/* statements/work-table.txt: WORK-TABLE DEFINITION - LIKE with Index */
DEFINE WORK-TABLE wtCustomer LIKE Customer NO-UNDO
  INDEX custIdx AS PRIMARY custNum.

/* statements/work-table.txt: WORK-TABLE - reference snippet */
DEFINE WORK-TABLE showsales
FIELD region LIKE SaleRrep.Region LABEL "Region"
FIELD state LIKE Customer.State LABEL "St"
FIELD tot-sales LIKE Customer.Balance COLUMN-LABEL "Total!Sales".
FOR EACH Customer, SalesRep OF Customer BREAK BY Customer.State:
ACCUMULATE Customer.Balance (TOTAL BY Customer.State).
IF LAST-OF(Customer.State) THEN DO:
CREATE showsales.
showsales.state = Customer.State.
showsales.tot-sales = ACCUM TOTAL BY Customer.State Customer.Balance.
showsales.region = SalesRep.Region.
END.
END.
FOR EACH showsales BREAK BY showsales.region BY showsales.state:
IF FIRST-OF(showsales.region) THEN
  DISPLAY showsales.region.
  DISPLAY showsales.state tot-sales (TOTAL BY showsales.region).
END.

DEFINE NEW SHARED WORK-TABLE wtShared FIELD f1 AS INTEGER.
DEFINE SHARED WORK-TABLE wtShared FIELD f1 AS INTEGER.
DEFINE PRIVATE WORK-TABLE wtPrivate FIELD f1 AS INTEGER.

/* statements/workfile.txt: WORKFILE DEFINITION - Basic Syntax */
DEFINE WORKFILE wfTest LIKE Customer.
DEF WORKFILE wfOrder LIKE Sales.Order.

/* statements/workfile.txt: WORKFILE DEFINITION - NO-UNDO Option */
DEFINE WORKFILE wfNoUndo LIKE Customer NO-UNDO.
DEF WORKFILE wfData LIKE ttOrder NO-UNDO.

/* statements/workfile.txt: WORKFILE DEFINITION - WITHOUT LIKE */
DEFINE WORKFILE wfSimple NO-UNDO.
DEF WORKFILE wfData NO-UNDO.

/* statements/workfile.txt: WORKFILE DEFINITION - Qualified Names */
DEFINE WORKFILE wfQual LIKE Sales.Customer.
DEF WORKFILE wfQ2 LIKE Database.Schema.Table.

/* statements/workfile.txt: WORKFILE DEFINITION - LIKE with Validated */
DEFINE WORKFILE wfVal LIKE Customer VALIDATE.
DEF WORKFILE wfOrder LIKE Sales.Order VALIDATE NO-UNDO.

/* statements/workfile.txt: WORKFILE DEFINITION - Minimal */
DEFINE WORKFILE w.
DEF WORKFILE wf.

/* statements/workfile.txt: WORKFILE DEFINITION - Shared/Private variants */
DEFINE NEW SHARED WORKFILE wfShared FIELD f1 AS INTEGER.
DEFINE SHARED WORKFILE wfShared FIELD f1 AS INTEGER.
DEFINE PRIVATE WORKFILE wfPrivate FIELD f1 AS INTEGER.
