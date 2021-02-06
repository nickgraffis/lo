var stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', "you're", "you've", "you'll", "you'd", 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', "she's", 'her', 'hers', 'herself', 'it', "it's", 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', "that'll", 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', "don't", 'should', "should've", 'now', 'd', 'll', 'm', 'o', 're', 've', 'y', 'ain', 'aren', "aren't", 'couldn', "couldn't", 'didn', "didn't", 'doesn', "doesn't", 'hadn', "hadn't", 'hasn', "hasn't", 'haven', "haven't", 'isn', "isn't", 'ma', 'mightn', "mightn't", 'mustn', "mustn't", 'needn', "needn't", 'shan', "shan't", 'shouldn', "shouldn't", 'wasn', "wasn't", 'weren', "weren't", 'won', "won't", 'wouldn', "wouldn't"];

function dot(vector1, vector2) {
  var result = 0;
  for (var i = 0; i < vector1.length; i++) {
    result += vector1[i] * vector2[i];
  }
  return result;
}

function sentenceTokinization (text) {
  return text.replace(/([.?!])\s*(?=[A-Z])/g, "$1|").split("|");
};

function tokenizeWords(text) {
  var processedText = text.replace(/[^a-zA-Z ]/g, "");
  processedText = processedText.replace(/\d+/g, '');
  var words = processedText.split(/\W+/).filter(function(token) {
      token = token.toLowerCase();
      return token.length >= 2 && stopwords.indexOf(token) == -1;
  });
  return words;
}
var nGramNumber = 2

function generate_ngrams (words, n) {
  var nGramsList = [];
  for (let i = 0; i < words.length; i++) {
    var nGramWord = words.slice(i, i + nGramNumber).join(' ');
    if (nGramWord.split(' ').length >= 2) {
      nGramsList.push(nGramWord);
    }
  }
  return nGramsList;
}

function frequencyOfWords(words) {
  var freq = {};
  var uniqueWords = [];
  for (let i = 0; i < words.length; i++) {
    if (!uniqueWords.includes(words[i])) {
      uniqueWords.push(words[i]);
    }
  }
  for (let i = 0; i < words.length; i++) {
    var result = words.filter(word => word === words[i]);
    freq[words[i]] = result.length;
  }
  return freq;
}

function tfScore (word, sentence) {
  var wordFreqInSentence = 1;
  var sentenceInNGrams = generate_ngrams(sentence.split(' '), nGramNumber);
  for (let i = 0; i < sentenceInNGrams.length; i++) {
    if (word === sentenceInNGrams[i]) {
      wordFreqInSentence++;
    }
  }
  var tf = wordFreqInSentence / sentenceInNGrams.length;
  return tf;
}

function idfScore (word, sentences) {
  var noOfSentencesContainingWord = 1;
  for (let i = 0; i < sentences.length; i++) {
    let eachSentenceInNGrams = generate_ngrams(sentences[i].split(' '), nGramNumber);
    for (let k = 0; k < eachSentenceInNGrams.length; k++) {
      if (word === eachSentenceInNGrams[k]) {
        noOfSentencesContainingWord++;
      }
    }
  }
  var idf = Math.log10(sentences.length / noOfSentencesContainingWord);
  return idf;
}

function createMatrix (text) {
  //Tokenize Sentences
  var sentences = sentenceTokinization(text);
  var numberOfWords = [];
  for (let i = 0; i < sentences.length; i++) {
    let words = generate_ngrams(tokenizeWords(sentences[i]), nGramNumber);
    numberOfWords.push(words.length);
  }
  var numberOfColumns = Math.max(...numberOfWords);
  var matrix = [];
  for (let i = 0; i < sentences.length; i++) {
    let words = generate_ngrams(tokenizeWords(sentences[i]), nGramNumber);
    let thisSentence = [];
    for (let k = 0; k < numberOfColumns; k++) {
      if (words[k]) {
        let tf = tfScore(words[k], sentences[i]);
        let idf = idfScore(words[k], sentences);
        let tfidfValue = tf * idf;
        thisSentence.push(tfidfValue);
      } else {
        thisSentence.push(0);
      }
    }
    matrix.push(thisSentence);
  }
  return matrix;
}

function zeros (columns, rows) {
  var matrix = [];
  var rowMatrix = [];
  for (let i = 0; i < columns; i++) {
    rowMatrix = [];
    for (let k = 0; k < rows; k++) {
      rowMatrix.push(0);
    }
    matrix.push(rowMatrix);
  }
  return matrix;
}

function cosineSimilarity (matrix) {
  var resultMatrix = zeros(matrix.length, matrix[0].length);
  var rowCount = 0;
  var columnCount = 0;
  for (let i = 0; i < matrix.length; i++) {
    var A = matrix[i];
    columnCount = 0;
    for (let k = 0; k < matrix.length; k++) {
      var B = matrix[k];
      abDotProduct = dot(A, B);
      denominator = Math.sqrt(dot(A, A)) * Math.sqrt(dot(B, B));
      cosTheta = abDotProduct / denominator;
      resultMatrix[rowCount][columnCount] = cosTheta;
      columnCount++;
    }
    rowCount++;
  }
  var sentenceImportance = {};
  var count = 0;
  for (let i = 0; i < resultMatrix.length; i++) {
    sentenceImportance[count] = resultMatrix[i].reduce((a, b) => a + b, 0) / resultMatrix[i].length;
    count++;
  }
  return sentenceImportance;
}

function sortObjectEntries(obj, n){
  let sortedList = []
  //Sorting by values asc
  sortedList = Object.entries(obj).sort((a,b)=>{
      if(b[1] > a[1]) return 1;
      else if(b[1] < a[1]) return -1;
  //if values are same do edition checking if keys are in the right order
      else {
         if(a[0] > b[0]) return 1;
         else if(a[0] < b[0]) return -1;
         else return 0
  }
  })
  // return first n values from sortedList
  return sortedList.map(el=>el[0]).slice(0,n)
}

function dumas (text, k) {
  var matrix = createMatrix(text);
  var cosSim = cosineSimilarity(matrix);
  var importantSentencesArray = sortObjectEntries(cosSim, k);
  var sentences = sentenceTokinization(text);
  var importantSentences = [];
  for (let i = 0; i < k; i++) {
    importantSentences.push(sentences[importantSentencesArray[i]]);
  }
  return importantSentences.join(' ');
}

module.exports = { dumas: dumas }
