//Objective is, given a dictionary and a number of times each phrase appears,
//to design a search autocomplete system.


//O(k * l) solution for the constructor, as we have to iterate over each phrase (k)
//and each word in the phrase (l)

//O(p + q + mlogm) solution for the input, as p refers to the length of the sentence,
//q refers to the number of nodes in the trie we have to traverse, and mlogm
//refers to the sorted result at the end

class AutoComplete {
    constructor(sentences, times) {
        this.root = {}
        this.inputString = ''
        
        for (let i = 0; i < sentences.length; i++) {
            this.insert(sentences[i], times[i])
        }
    }

    insert(word, times) {
        let node = this.root 
    
        for (let char of word) {
            if (!node[char]) {
                node[char] = {}
            }
            node = node[char]
        }
        node.wordEnd = true
        
        if (node.times == undefined) {
            node.times = times
        } else {
            node.times++
        }
    }

    input(c) {
        //Reset the string, as '#' denotes a new search
        if (c == '#') {
            this.insert(this.inputString, 1)
            this.inputString = ''
            return []
        }
        
        this.inputString += c
        let node = this.root 
        
        //Go as deep as you can with given characters
        //If a character is passed that doesn't exist, return []
        for (let char of this.inputString) {
            if (node[char]) {
                node = node[char]
            } else {
                return []
            }
        }
        
        let result = {}
        
        //Search the rest of the word using the dictionary
        //Map them via how many times they showed up and sort them lexicographically
        function dfs(node, char) {
            for (let key in node) {
                if (key == 'wordEnd') {
                    if (!result[node.times]) {
                        result[node.times] = []
                    }
                    result[node.times].push(char)
                    result[node.times].sort()
                }
                dfs(node[key], char + key)
            }
        }
        dfs(node, this.inputString)
        
        //Sort the results by how many times they showed up
        let sorted = []
        let sortedKeys = [...Object.keys(result)].sort((a,b) => b - a)
        
        for (let key of sortedKeys) {
            sorted.push(...result[key])
        }
        
        return sorted.slice(0, 3)
    }
}

let dict = new AutoComplete(["i love you","island","iroman","i love leetcode"],[5,3,2,2])
dict.input(["i"])
dict.input([" "])
dict.input(["a"])
dict.input(["#"])