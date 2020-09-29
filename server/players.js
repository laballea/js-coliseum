class pf{
    constructor (map) {
        this.map = map;
    }
    get_near(y, x) {
        if (y < 0 || y >= this.map.largeur)
            return (undefined);
        if (x < 0 || x >= this.map.hauteur)
            return (undefined);
        let obj = this.map.t_map[y][x];
        if (obj.empty == true && obj.isPers == undefined)
            return (this.map.t_map[y][x]);
        else
            return (undefined);
    }
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
    get_neighbor(obj) {
        let neighbor = new Array(4);
        neighbor[0] = this.get_near(obj.rposy, obj.rposx - 1);
        neighbor[1] = this.get_near(obj.rposy + 1, obj.rposx);
        neighbor[2] = this.get_near(obj.rposy - 1, obj.rposx);
        neighbor[3] = this.get_near(obj.rposy, obj.rposx + 1);
        return (this.shuffle(neighbor));
    }
    get_lowest_fscore(openset){
        var obj = openset[0];
        var mem;
        if (obj == undefined)
            mem = Infinity;
        else
            mem = obj.fScore;
        for (let i = 0; i < openset.length; i++)
        {
            if (openset[i] != undefined && openset[i].fScore < mem)
            {
                mem = openset[i].fScore;
                obj = openset[i];
            }   
        }
        return (obj);
    }
    h(start, obj) {
        let nXDifferenceTiles = Math.round(Math.abs(obj.rposx - start.rposx));
        let nYDifferenceTiles = Math.round(Math.abs(obj.rposy - start.rposy));
        let cost = nXDifferenceTiles + nYDifferenceTiles;
        return (cost);
    }
    get_index(openSet, item) {
        for (let i = 0; i < openSet.length; i++)
        {
            if (openSet[i] == item)
                return (i);
        }
        return (undefined);
    }
    in(lst, obj) {
        let i = 0;
        while (i < lst.length)
        {
            if (lst[i] == obj)
                return (1);
            i++;
        }
        return (0);
    }
    init_path(node, obj) {
        if (node.fScore != Infinity) {
            if ((this.h(node, obj) + 1) * 10 < node.fScore)
                return (1);
            else
                return (0);
        }
        return (0);
    }
    get_path(end) {
        let path = [];
        let tmp = end;
        while (tmp.cameFrom != undefined)
        {
            path.push(tmp);
            tmp = tmp.cameFrom;
        }
        this.map.reset_score();
        return (path.reverse());
    }
    pathfinding(obj, player) {
        let start = player.bloc;
        start.gScore = 0;
        start.fScore = 30;
        let openset = new Array(1);
        let closedset = new Array();
        openset[0] = start;
        let n = -1;
        let max = player.pm * player.pm;
        let current;
        let neighbor;
        while (1 && ++n < max)
        {
            if ((current = this.get_lowest_fscore(openset)) == undefined)
                break;
            openset.splice(this.get_index(openset, current), 1);
            closedset.push(current);
            if (current.posx == obj.posx && current.posy == obj.posy)
                return (this.get_path(obj));
            else
            {
                neighbor = this.get_neighbor(current);
                for (let i = 0; i < neighbor.length; i++)
                {
                    if (neighbor[i] != undefined)
                    {
                        if(this.in(closedset, neighbor[i]))
                            ;
                        else if (this.init_path(neighbor[i], obj) || !this.in(openset, neighbor[i]))
                        {
                            neighbor[i].gScore = 1;
                            neighbor[i].fScore = (this.h(neighbor[i], obj) + neighbor[i].gScore) * 10;
                            neighbor[i].cameFrom = current;
                            if (!this.in(openset, neighbor[i]))
                                openset.push(neighbor[i]);
                        }
                    }
                }
            }
        }
        return (undefined);
    }
}

class Player {
	classe;
	pseudo;
	id;
	pos;
	rank;

	constructor(classe, pseudo, pos, id, map) {
		this.classe = classe;
		this.pseudo = pseudo;
		this.pos = pos;
		this.id = id;
		this.bloc = map.t_map[pos[0]][pos[1]];
		this.pf = new pf();
	}
	move (x, y) {
		this.pos = [x, y];
	}
}

module.exports = {
	Player
}