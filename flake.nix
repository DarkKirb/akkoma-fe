{
  description = "Description for the project";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-parts.url = "github:hercules-ci/flake-parts";
    devshell.url = "github:numtide/devshell";
    flake-compat.url = "github:edolstra/flake-compat";
  };

  outputs = inputs @ {flake-parts, ...}:
    flake-parts.lib.mkFlake {inherit inputs;} {
      imports = [
        inputs.devshell.flakeModule
      ];
      systems = ["x86_64-linux" "aarch64-linux"];
      perSystem = {
        config,
        self',
        inputs',
        pkgs,
        system,
        ...
      }: {
        devshells.default.devshell.packages = with pkgs; [
          nodejs
          yarn
          yarn2nix
        ];
        packages.akkoma-fe = with pkgs;
          mkYarnPackage rec {
            pname = "akkoma-fe";
            version = inputs.self.lastModifiedDate;
            src = ./.;

            packageJSON = ./package.json;
            yarnLock = ./yarn.lock;
            yarnNix = ./yarn.nix;

            nativeBuildInputs = [
              jpegoptim
              oxipng
              nodePackages.svgo
            ];

            patchPhase = ''
              sed -E -i \
                -e '/^let commitHash =/,/;$/clet commitHash = "${builtins.substring 0 7 (inputs.self.rev or "00000000")}";' \
                build/webpack.prod.conf.js
            '';

            configurePhase = ''
              cp -r $node_modules node_modules
              for f in $(find node_modules/jxl.js -type f); do chmod -v +w $f; done
              for f in $(find node_modules/jxl.js -type l);do cp -rv --remove-destination $(readlink $f) $f;done;
            '';

            buildPhase = ''
              export NODE_OPTIONS=--openssl-legacy-provider
              yarn build --offline
            '';
            installPhase = "cp -rv dist $out";
            distPhase = ''
              # (Losslessly) optimise compression of image artifacts
              find $out -type f -name '*.jpg' -execdir ${jpegoptim}/bin/jpegoptim -w$NIX_BUILD_CORES {} \;
              find $out -type f -name '*.png' -execdir ${oxipng}/bin/oxipng -o max -t $NIX_BUILD_CORES {} \;
              find $out -type f -name '*.svg' -execdir ${nodePackages.svgo}/bin/svgo {} \;
            '';
          };
        formatter = pkgs.alejandra;
      };
      flake = {
        hydraJobs = {
          inherit (inputs.self) devShells packages formatter;
        };
      };
    };
}
