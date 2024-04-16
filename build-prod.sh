#node patch  if some error, run node patch after npm i

# To reslove Error: error:0308010C:digital envelope routines::unsupported:#-
# On Unix-like (Linux, macOS, Git bash, etc.):                            #-
export NODE_OPTIONS=--openssl-legacy-provider                             #-
                                                                          #-
# On Windows command prompt:                                              #-
set NODE_OPTIONS=--openssl-legacy-provider                                #-
                                                                          #-
#On PowerShell:                                                           #-
$env:NODE_OPTIONS = "--openssl-legacy-provider"                           #-
#-------------------------------------------------------------------------#-

ng build --prod=true --aot=true --optimization=true
