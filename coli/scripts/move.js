
/* Check si la case passer en paramatere est adjacente*/
function check_t_r(act_pers, posx, posy){
    if (act_pers.posx + (act_pers.posy % 2) == posx && act_pers.posy - 1 == posy)
        return (1)
    else
        return (0);
}

function check_b_l(act_pers, posx, posy){
    if (act_pers.posx - Math.abs((act_pers.posy % 2 - 1)) == posx && act_pers.posy + 1 == posy)
        return (1)
    else
        return (0);
}

function check_b_r(act_pers, posx, posy){
    if (act_pers.posx + (act_pers.posy % 2) == posx && act_pers.posy + 1 == posy)
        return (1)
    else
        return (0);
}

function check_t_l(act_pers, posx, posy){
	if (act_pers.posx - Math.abs((act_pers.posy % 2 - 1)) == posx && act_pers.posy - 1 == posy)
		return (1)
    else
        return (0);
}
/*END*/

/* Position du act_perso est égal à la position du bloc clique */
function move() {
    act_pers.posx = act_pers.bloc.posy;
    act_pers.posy = act_pers.bloc.posx;
    return (1)
}
/*END*/

/* Check si la case clique est adjacente, si oui bouge le act_perso */
function move_t_r(){
    if (check_t_r(act_pers, act_pers.bloc.posy, act_pers.bloc.posx) && act_pers.pm - 1 >= 0)
        return (move())
    else
        return (0);
}

function move_b_l(){
    if (check_b_l(act_pers, act_pers.bloc.posy, act_pers.bloc.posx) && act_pers.pm - 1 >= 0)
        return (move())
    else
        return (0);
}

function move_b_r(){
    if (check_b_r(act_pers, act_pers.bloc.posy, act_pers.bloc.posx) && act_pers.pm - 1 >= 0)
        return (move())
    else
        return (0);
}

function move_t_l(){
	if (check_t_l(act_pers, act_pers.bloc.posy, act_pers.bloc.posx) && act_pers.pm - 1 >= 0)
		return (move())
    else
        return (0);
}
/*END*/