&GLOBAL-DEFINE LIMIT 10
// <- keyword.directive
//             ^ constant.macro
//                   ^ string.special
&SCOPED-DEFINE LABEL test
// <- keyword.directive
//             ^ constant.macro
&IF {&LIMIT} > 1 &THEN
// <- keyword.directive
//    ^ constant.macro
//             ^ number
//               ^ keyword.directive
MESSAGE "enabled".
// <- keyword
//      ^ string
&ELSEIF {&LIMIT} = 1 &THEN
// <- keyword.directive
//                   ^ keyword.directive
MESSAGE "one".
&ELSE
// <- keyword.directive
MESSAGE {&LABEL}.
//        ^ constant.macro
&ENDIF
// <- keyword.directive
  {includes/setup.i &mode="test"}
// ^ string.special.path
//                   ^ variable.parameter
&UNDEFINE LIMIT
// <- keyword.directive
//        ^ constant.macro
&ANALYZE-SUSPEND _UIB-CODE-BLOCK
// <- keyword.directive
&ANALYZE-RESUME
// <- keyword.directive
MESSAGE {&MISSING = "fallback"}.
//        ^ constant.macro
//                  ^ string
MESSAGE {1}.
//      ^ constant.macro
