proxy() {
  NPM_PROXY=""
  HOME_PROXY="http://127.0.0.1:7890"
  WORK_PROXY="http://127.0.0.1:12759"
  PROXY_RULE=$1

  # set proxy
  if [ "$1" = "home" ]; then
    export ALL_PROXY=$HOME_PROXY
    NPM_PROXY=$HOME_PROXY
    echo "Proxy set as $1: $HOME_PROXY"
  elif [ "$1" = "work" ]; then
    export ALL_PROXY=$WORK_PROXY
    NPM_PROXY=$WORK_PROXY
    echo "Proxy set as $1: $WORK_PROXY"
  elif [ -n "$1" ]; then
    export ALL_PROXY=$1
    NPM_PROXY=$1
    echo "Proxy set as: $1"
  else
    NPM_PROXY=""
    echo ""
    echo "Usage: proxy <rule>"
    echo ""
    echo "where <rule> is one of: home, work, [host:port]"
    echo ""
    echo "proxy home \t\t\t\t Proxy set as: $HOME_PROXY"
    echo "proxy work \t\t\t\t Proxy set as: $WORK_PROXY"
    echo "proxy http://127.0.0.1:8080 \t\t Proxy set as: http://127.0.0.1:8080"
    echo ""
  fi

  # set npm proxy
  if [[ -n "$(command -v npm)" ]] && [[ -n "$NPM_PROXY" ]]; then
    npm config set proxy=$NPM_PROXY
    echo "npm proxy set as: $NPM_PROXY"
  fi
}

unproxy() {
  unset ALL_PROXY
  echo "Proxy unset"

  if [ -n "$(command -v npm)" ]; then
    npm config delete proxy
    echo "npm proxy deleted"
  fi
}

export NO_PROXY=localhost,127.0.0.1,172.,10.,192.
