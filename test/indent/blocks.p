PROCEDURE processOrders:
  DEFINE VARIABLE count AS INTEGER NO-UNDO.
  DO TRANSACTION:
    FOR EACH Customer NO-LOCK:
      IF Customer.Active THEN DO:
        MESSAGE Customer.Name.
      END.
      ELSE DO:
        MESSAGE "inactive".
      END.
    END.
    CATCH err AS Progress.Lang.Error:
      MESSAGE err:GetMessage(1).
    END CATCH.
    FINALLY:
      MESSAGE "done".
    END FINALLY.
  END.
  REPEAT count = 1 TO 3:
    CASE count:
      WHEN 1 THEN
        MESSAGE "one".
      WHEN 2 THEN DO:
        MESSAGE "two".
      END.
      OTHERWISE
        MESSAGE "other".
    END CASE.
  END.
  IF count = 1 THEN
    MESSAGE "one".
  ELSE
    MESSAGE "other".
END PROCEDURE.
FUNCTION addOne RETURNS INTEGER (INPUT value AS INTEGER):
  RETURN value + 1.
END FUNCTION.
MESSAGE addOne(1).
IF TRUE THEN
  MESSAGE "first".
ELSE IF FALSE THEN DO:
  MESSAGE "second".
END.
ELSE
  MESSAGE "third".
DO.
  MESSAGE "period opener".
END.
