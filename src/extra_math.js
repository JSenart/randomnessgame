//Approximate implementation of the error function
function erf(x) {
    // constants
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var p  =  0.3275911;

    // Save the sign of x
    var sign = 1;
    if (x < 0) {
        sign = -1;
    }
    x = Math.abs(x);

    // A&S formula 7.1.26
    var t = 1.0/(1.0 + p*x);
    var y = 1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-x*x);

    return sign*y;
}


//Binary Shannon entropy
function bShannon(p) {
    if(0<p&&p<1) {
        return -( p*Math.log2(p) + (1-p)*Math.log2(1-p) );
    }
    else {
        return 0;
    }
}


//Mean of array
function mean(arr) {
    //Compute mean
    var tot=0;
    for (var k=0; k<arr.length; k++) {tot+=arr[k]};
    return tot/arr.length;    
}


//Implement a Wald-Wolfowitz run test on a given string of numbers and return p-value
function pWaldWolfowitz(narr) {
    //Compute mean
    var mnarr= mean(narr);

    //Compute signs
    for (var k=0; k<narr.length; k++) {narr[k] = Math.sign(narr[k]-mnarr)};
    //Discard any zeros
    for (var k=narr.length-1; k>=0; k--) {if(!(narr[k]==1||narr[k]==-1)){narr.splice(k,1)}};

    //Compute number of positive and negative signs, discard any zeros
    var np=0; var nm=0;
    for (var k=0; k<narr.length; k++) {
        if (narr[k]==1) {np++};
        if (narr[k]==-1) {nm++};
    };

    //Compute expected mean and variance of expected number of runs (sequences of identical signs)
    var ntot = np+nm;
    var mu = 1 + 2*np*nm/ntot;
    var s = (mu-1)*(mu-2)/(ntot-1);

    //Compute observed number of runs
    var nrun=0;
    for (var k=0; k<narr.length-1; k++) {if(narr[k]<narr[k+1]||narr[k]>narr[k+1]){nrun++}};

    //Compute the p-value for the observed number of runs and return
    return 1-erf(Math.abs(nrun-mu)/(Math.sqrt(2*s)));
}


//Implement a Wald-Wolfowitz run test on a given string of numbers and return deviation
//from expected mean measured in expected standard deviations
function devWaldWolfowitz(narr) {
    //Copy the input argument to new variable because javascript uses pass by reference and we don't want to alter narr
    var arr = narr.slice(0);
    //Length of sample
    n = arr.length;
    
    //Compute mean
    var mnarr = mean(arr);

    //Compute signs
    sgnarr=[];
    for (var k=0; k<n; k++) {sgnarr.push(Math.sign(arr[k]-mnarr))};
    //Discard any zeros
    for (var k=n-1; k>=0; k--) {if(!(sgnarr[k]==1||sgnarr[k]==-1)){arr.splice(k,1)}};
    
    //If there is nothing left
    if(arr.length==0){ return 999; }
    

    //Compute number of positive and negative signs
    var np=0; var nm=0;
    for (var k=0; k<sgnarr.length; k++) {
        if (sgnarr[k]==1) {np++};
        if (sgnarr[k]==-1) {nm++};
    };

    //Compute expected mean and variance of expected number of runs (sequences of identical signs)
    var ntot = np+nm; //this should be = n, could just use n
    var mu = 1 + 2*np*nm/ntot;
    var s = (mu-1)*(mu-2)/(ntot-1);

    //Compute observed number of runs
    var nrun=1;
    for (var k=0; k<n-1; k++) {if(sgnarr[k]<sgnarr[k+1]||sgnarr[k]>sgnarr[k+1]){nrun++}};

    //Deviation measured in standard deviations
    if(s!=0) {
        return Math.abs(nrun-mu)/Math.sqrt(s);
    }
    else {
        return 999;
    }
}


//Autocorrelation in data narr for separation d
function autoCorrelation(narr,d) {
    //Number of samples
    var n = narr.length;
    //Compute sample mean
    var tot=0;
    for (var k=0; k<narr.length; k++) {tot+=narr[k]};
    var mu = tot/n;    
    //Compute sample variance
    var tot=0;
    for (var k=0; k<n; k++) {tot+=(narr[k]-mu)*(narr[k]-mu)};
    var s = tot/n;    
    
    //Compute and return estimate of the autocorrelation
    tot=0;
    for (var k=0; k<n-d; k++) {tot += (narr[k]-mu)*(narr[k+d]-mu)}
    if(s!=0) {
        return tot/(s*(n-d));    
    }
    else {
        return 1;
    }
}


//Mean absolute autocorrelation for separations up to a fraction fmax of the sample length
//Use at least separation 1
function meanAC(narr,fmax) {
    //Compute autocorrelations up to fmax of the string length
    var dmax = Math.max(1,Math.floor(narr.length*fmax));
    var aCs = [];
    for (var k=0; k<dmax; k++) {
        aCs[k] = autoCorrelation(narr,k+1);
    }
    //Get the mean absolute autocorrelation
    var tot=0;
    for (var k=0; k<dmax; k++) {tot+=Math.abs(aCs[k])};
    return tot/dmax;    
}



/*function carlosAC(narr,d) {
    //Number of samples
    var n = narr.length;
    //Compute sample mean
    var tot=0;
    for (var k=0; k<narr.length; k++) {tot+=narr[k]};
    var mu = tot/n;    
    //Compute samle variance
    var tot=0;
    for (var k=0; k<narr.length; k++) {tot+=(narr[k]-mu)*(narr[k]-mu)};
    var s = tot/n;    
    
    //Compute and return estimate of the autocorrelation
    tot=0;
    for (var k=0; k<n-d; k++) {tot += (narr[k]-mu)*(narr[k+d]-mu)}
    return tot/(s*(n-d));    
}*/


//Figure of merit from Carlos Abellan
function carlos(narr,dmax) {
    //Number of samples
    var n = narr.length;
    //Compute sample mean
    var tot=0;
    for (var k=0; k<narr.length; k++) {tot+=narr[k]};
    var mu = tot/n;
    
    tot=0;
    for(var d=1; d<=dmax; d++) {
        tmp=0;
        for(var k=0; k<n-d; k++) {
            tmp += narr[k]*narr[k+d];
        }
        var gamd = Math.abs(tmp/(n-d) - mu*mu);
        var sigd = 1/Math.sqrt(n-d);
        tot += gamd/(2*sigd)
    }
    
    return 1-tot/dmax;
}



//predict new digits based on observed frequencies of transitions
//narr is the string of numbers, dmax is the maximal chunk length to use for predictions
//m is the number of digits used, i.e. m=2 for bits, m=3 for trits etc.
function predictive(narr,dmax,m) {    
    
    //Initialise matrices of transition frequencies (from chunk of length d to next digit)
    var transMats = [];
    //There are dmax transition matrices
    for(var d=1; d<=dmax; d++) {
        transMats[d-1] = [];
        //Each matrix has dimension m^d by m
        for(var r=0; r<Math.pow(m,d); r++) {
            transMats[d-1][r] = [];
            for(var s=0; s<m; s++) {
                transMats[d-1][r][s] = 0;
            }
        }
    }
    
    //Initialise holder of preceeding chunks
    var prevs = [];
    //store the first digit
    prevs[0] = narr[0];
    //set to dummy zero for longer chunks
    for(var d=2; d<=dmax; d++) {
        prevs[d-1]=0;
    }
    
    //Initialise list of positions of guessed digits
    corrects = [];
    
    //Run through the string of numbers, updating the transition matrices as we go
    //Generate guesses for the next number in the string based on the matrices and
    //collect a score by comparing with the actual bit value
    for(var k=1; k<narr.length-1; k++) {
        
        // GUESS
        //---
        //Compute prediction for the next number in the string
        //Initialise holder of predicted digits and probabilities
        pguess = [];
        for(var d=1; d<=dmax; d++) {pguess[d-1] = [0,0];}
        //For each chunk length, extract the most probable next digit (or the first one, if some have equal frequencies)
        for(var d=1; d<=Math.min(dmax,k); d++) {
            for(var n=0; n<m; n++) {
                //get frequency of transition from preceeding chunk to digit n
                tmp = transMats[d-1][prevs[d-1]][n];
                //if this frequency is larger than for the stored digit, replace the stored freq and digit by this one
                if(tmp>pguess[d-1][1]) {pguess[d-1] = [n,tmp];}
            }
            //Convert transition frequencies to probabilities
            if(pguess[d-1][1] > 0) {
                tot=0;
                for (var n=0; n<m; n++) {tot+=transMats[d-1][prevs[d-1]][n];}
                pguess[d-1][1] = pguess[d-1][1]/tot;
            }
        }
        //To extract a prediction, just take the digit with maximal probability over all preceeding chunk lengths
        var pmax = 0;
        var guess = Math.floor(m*Math.random());
        for(var d=1; d<=Math.min(dmax,k); d++) {
            if(pguess[d-1][1] > pmax) {
                guess = pguess[d-1][0];                
                pmax = pguess[d-1][1];
            }
        }
        //Compare the prediction against the current digit, and update the list of correctly predicted digits
        if(guess == narr[k]) {
            corrects.push(k);
        }
        //---
        // /GUESS
        
        //Update transition matrices with transition to current digit
        for(var d=1; d<=dmax; d++) {
            transMats[d-1][prevs[d-1]][narr[k]] += 1;
        }        
        
        //Update preceeding chunks to include the current digit
        for(var d=1; d<=Math.min(dmax,k+1); d++) {
            //Build up the index corresponding to the preceeding chunk (a0,a1,...,a(d-1)) of length d as a0+a1*m+a2*m^2+...+a(d-1)*m^(d-1)
            tmp=0;
            for(var r=0; r<=d-1; r++) {
                tmp = m*tmp;
                tmp += narr[k-r];
            }
            prevs[d-1] = tmp;
        }        
        
    }
    
    //Return the list of positions of correctly predicted digits in the input string
    return corrects;
}



/*//Get randomness score
function getScore(narr) {
    //If there is only one symbol, return zero
    if (narr.length<2) {return 0}
    
    //Use prediction based on transition frequencies (for bits).
    //Take the fraction of correct guesses. Compute the deviation
    //from 1/2 and scale to lie in [0,100]. 
    var guessed = predictive(narr,3,2); //For bits, max chunk length 3.
    var frac = guessed.length / (narr.length-1);
    return 100*(1-2*Math.abs(frac - 0.5));
}*/

//Get randomness score
function getScore(narr) {
    //If there is only one symbol, return zero
    if (narr.length<2) {return 0}
    
    //Use the Wald-Wolfowitz deviation scaled to lie in [0,100]. 
    //Score 0 if you deviate by more than 5 standard deviations.
    var dev = devWaldWolfowitz(narr);
    
    if(dev==999){return 0}
    else{ return 100*Math.max(5-dev,0)/5;}
}

/*//Get randomness score
function getScore(narr) {
    //If there is only one symbol, return zero
    if (narr.length<2) {return 0}
    
    //Compute the bias
    bias = bShannon(mean(narr));
    
    //If only one symbol occurs, return zero
    if(bias==0) {return 0}
    
    //Otherwise build a more complicated score function
    
    //Use the autocorrelation and the bias
    var mAC = Math.max( bias-meanAC(narr,0.1) , 0 );
    return 100*mAC;
}*/

/*//Get randomness score
function getScore(narr) {
    //If there is only one symbol, return zero
    if (narr.length<2) {return 0}
    
    //Compute the bias
    bias = bShannon(mean(narr));
    
    //If only one symbol occurs, return zero
    if(bias==0) {return 0}
    
    //Use the autocorrelation scaled to lie in [0,100].
    var mAC = 1-meanAC(narr,0.1);
    return 100*mAC;
}*/

/*//Get randomness score
function getScore(narr) {
    //If there is only one symbol, return zero
    if (narr.length<2) {return 0}
    
    //Use the figure of merit from Carlos scaled to lie in [0,100]. 
    var dev = carlos(narr,10);
    return 100*dev;
}*/