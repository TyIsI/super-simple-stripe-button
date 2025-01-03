set export

help:
    just -l

build target:
    @echo 'Building {{target}}…'
    just "build_{{target}}"

build_all: build_full build_min

build_full:
    node_modules/.bin/esbuild src/super-simple-stripe-button.ts --bundle --sourcemap --target=chrome58,firefox57,safari11,edge16 --external:jquery --outfile=assets/super-simple-stripe-button.js

build_min:
    node_modules/.bin/esbuild src/super-simple-stripe-button.ts --bundle --minify --sourcemap --target=chrome58,firefox57,safari11,edge16 --external:jquery --outfile=assets/super-simple-stripe-button.min.js

format target:
    @echo 'Formatting {{target}}…'
    just "format_{{target}}"

format_all:
    #!/usr/bin/env bash
    set -eo pipefail

    echo "Formatting ${FILES:-.}"

    node_modules/.bin/prettier -w ${FILES:-.}

format_php:
    #!/usr/bin/env bash
    set -eo pipefail

    just setup vendor

    vendor/bin/php-cs-fixer fix --config=.php-cs-fixer.php ${FILES:-common.php config.template.php functions.php handler.php super-simple-stripe-button.php}

install target:
    @echo 'Installing {{target}}…'
    just "install_{{target}}"

install_composer:
    #!/usr/bin/env bash
    set -euo pipefail

    if [ ! -f ./tools/composer.phar ]; then
        TMPFILE=$(mktemp)

        EXPECTED_CHECKSUM="$(php -r 'copy("https://composer.github.io/installer.sig", "php://stdout");')"
        php -r "copy('https://getcomposer.org/installer', '${TMPFILE}');"
        ACTUAL_CHECKSUM="$(php -r "echo hash_file('sha384', '${TMPFILE}');")"

        if [ "$EXPECTED_CHECKSUM" != "$ACTUAL_CHECKSUM" ]; then
            echo >&2 'ERROR: Invalid installer checksum'
            rm "${TMPFILE}"
            exit 1
        fi

        php "${TMPFILE}" --install-dir ./tools --quiet
        rm "${TMPFILE}"
    else
        echo "composer has already been set up!"
    fi

    ./tools/composer.sh install

install_dev:
    echo "Installing dev dependencies"
    tools/composer.sh install --dev -q

install_prod:
    echo "Installing production dependencies only"
    tools/composer.sh install --no-dev -q

run_composer:
    echo "Running composer"
    ./tools/composer.sh install -q

setup target:
    @echo 'Setting up {{target}}…'
    just "setup_{{target}}"

setup_commit: install_prod
    #!/usr/bin/env bash
    set -euo pipefail

    if [ "$(git diff --cached --name-only --diff-filter=ACMR | grep -E 'src\/.+')" != "" ]; then
        echo "Found changed src files. Building..."
        pnpm run build
    fi

    if [ "$(git diff --cached --name-only --diff-filter=ACMR | grep vendor)" != "" ]; then
        echo "Found changed vendor files. Updating..."
        echo "Going from $(git diff --cached --name-only --diff-filter=ACMR | wc -l)"
        pnpm exec just install prod && git rm --cache -f -r vendor && git add vendor
        echo "To: $(git diff --cached --name-only --diff-filter=ACMR | wc -l)"
    fi

setup_husky:
    #!/usr/bin/env bash
    set -euo pipefail

    if [ ! -d .husky/_/ ]; then
        node_modules/.bin/husky
    else
        echo "husky has already been set up!"
    fi

setup_vendor: install_composer run_composer
