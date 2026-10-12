CLASS Demo.Sample INHERITS Demo.Base IMPLEMENTS Demo.Contract:
//         ^ type
//                              ^ type
//                                                   ^ type
  DEFINE PUBLIC PROPERTY Name AS CHARACTER NO-UNDO GET. SET.
//                       ^ property
//                               ^ type.builtin
  CONSTRUCTOR PUBLIC Sample():
//                   ^ constructor
  END CONSTRUCTOR.
  METHOD PUBLIC INTEGER Calculate(INPUT value AS INTEGER):
//                      ^ function.method
//                                      ^ variable.parameter
    DEFINE VARIABLE item AS CLASS Demo.Item NO-UNDO.
//                                     ^ type
    item = NEW Demo.Item().
//                  ^ type
    RETURN value.
  END METHOD.
END CLASS.
ENUM State:
//   ^ type
  DEFINE ENUM Ready = 1.
//            ^ constant
END ENUM.
