{
  prsJSON,
  nixpkgs,
}: let
  pkgs = import nixpkgs {};
  prs = builtins.fromJSON (builtins.readFile prsJSON);
  jobsets =
    (builtins.listToAttrs (
      pkgs.lib.attrsets.mapAttrsToList (
        _: info: {
          name = "pr${toString info.number}";
          value = {
            enabled = info.state == "open";
            hidden = info.state != "open";
            description = "PR ${toString info.number}: ${info.title}";
            nixexprinput = "akkoma-fe";
            nixexprpath = "hydra/default.nix";
            checkinterval = 3600;
            schedulingshares = 100;
            enableemail = false;
            emailoverride = "";
            keepnr = 1;
            inputs = {
              akkoma-fe = {
                type = "git";
                value = "${info.head.repo.clone_url} ${info.head.ref}";
                emailresponsible = false;
              };
              nixpkgs = {
                type = "git";
                value = "https://github.com/NixOS/nixpkgs.git master";
                emailresponsible = false;
              };
              github_input = {
                type = "string";
                value = "akkoma-fe";
              };
              github_repo_owner = {
                type = "string";
                value = info.head.repo.owner.login;
              };
              github_repo_name = {
                type = "string";
                value = info.head.repo.name;
              };
            };
          };
        }
      )
      prs
    ))
    // {
      akkoma-fe = {
        enabled = 1;
        hidden = false;
        description = "Akkoma akkoma-fe";
        nixexprinput = "akkoma-fe";
        nixexprpath = "hydra/default.nix";
        checkinterval = 0;
        schedulingshares = 100;
        enableemail = false;
        emailoverride = "";
        keepnr = 1;
        inputs = {
          akkoma-fe = {
            type = "git";
            value = "https://github.com/DarkKirb/akkoma-fe develop";
            emailresponsible = false;
          };
          nixpkgs = {
            type = "git";
            value = "https://github.com/NixOS/nixpkgs.git master";
            emailresponsible = false;
          };
          github_input = {
            type = "string";
            value = "akkoma-fe";
          };
          github_repo_owner = {
            type = "string";
            value = "DarkKirb";
          };
          github_repo_name = {
            type = "string";
            value = "akkoma-fe";
          };
        };
      };
    };
in {jobsets = pkgs.writeText "jobsets.json" (builtins.toJSON jobsets);}
