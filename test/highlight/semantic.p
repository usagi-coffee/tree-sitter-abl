DeF VaR amount AS INTEGER NO-UNDO.
// <- keyword
//  ^ keyword
//      ^ variable
//                ^ type.builtin
//                        ^ keyword
amount = 42 + 3.
//       ^ number
//          ^ operator
IF amount GE 1 AND amount < 100 THEN
// <- keyword.conditional
//        ^ keyword.operator
//             ^ keyword.operator
//                        ^ operator
//                              ^ keyword.conditional
  MESSAGE SuBsTrInG("value", 1).
//        ^ function.builtin
//                  ^ string
ELSE MESSAGE ?.
// <- keyword.conditional
//           ^ constant.builtin
MESSAGE TRUE false YES no.
//      ^ boolean
//           ^ boolean
//                 ^ boolean
//                     ^ boolean
MESSAGE customer.Name.
//      ^ variable
//               ^ property
MESSAGE customer:Address:ToString().
//      ^ variable
//               ^ property
//                       ^ function.method.call
MESSAGE service:SUBSTRING("x", 1).
//      ^ variable
//              ^ function.method.call
MESSAGE SESSION:HANDLE.
//      ^ variable.builtin
//              ^ property
RUN jobs/report.p.
//  ^ function.call
FUNCTION twice RETURNS INTEGER (INPUT value AS INTEGER):
//       ^ function
//                                    ^ variable.parameter
  RETURN value * 2.
END FUNCTION.
MESSAGE twice(amount).
//      ^ function.call
DEFINE VARIABLE substring AS CHARACTER.
//              ^ variable
//                           ^ type.builtin
/* MESSAGE IF TRUE */
// <- comment
MESSAGE "IF TRUE /* comment */".
//      ^ string
DEFINE VARIABLE message AS CHARACTER NO-UNDO.
//              ^ variable
//                                   ^ keyword
MESSAGE message.
//      ^ variable
MESSAGE TODAY NoW TIME.
//      ^ function.builtin
//            ^ function.builtin
//                ^ function.builtin
MESSAGE customer.Today.
//               ^ property
