FUNCTION twice RETURNS INTEGER (value AS INTEGER):
//       ^ definition.function
  RETURN value * 2.
END FUNCTION.
PROCEDURE execute:
//        ^ definition.function
  MESSAGE twice(2).
//        ^ reference.call
END PROCEDURE.
DEFINE TEMP-TABLE tt FIELD id AS INTEGER.
//                ^ definition.type
FUNCTION pending RETURNS INTEGER () FORWARD.
//       ^ definition.function
RUN VALUE("computed.p").
