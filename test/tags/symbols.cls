CLASS Demo.Sample INHERITS Demo.Base IMPLEMENTS Demo.Contract:
//    ^ definition.class
//                         ^ reference.class
//                                              ^ reference.implementation
  DEFINE PUBLIC PROPERTY Name AS CHARACTER NO-UNDO GET. SET.
//                       ^ definition.property
  CONSTRUCTOR PUBLIC Sample():
//                   ^ definition.method
  END CONSTRUCTOR.
  METHOD PUBLIC VOID Execute():
//                   ^ definition.method
    service:Address:Save().
//                  ^ reference.call
    RUN jobs/report.p.
//      ^ reference.call
  END METHOD.
END CLASS.
