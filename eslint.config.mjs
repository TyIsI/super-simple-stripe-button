import ts from '@tyisi/config-eslint/ts'
import globals from 'globals'

ts[0].languageOptions.globals = {
    ...ts[0].languageOptions.globals,
    ...globals.browser,
    jQuery: false
}

export default [...ts]
