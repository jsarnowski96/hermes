import React from 'react';
import {withTranslation} from 'react-i18next';
import {Redirect} from 'react-router-dom';

import {getJwtDataFromSessionStorage, setJwtDataInSessionStorage} from '../../middleware/jwtSessionStorage';

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.jwt = getJwtDataFromSessionStorage();

        if(this.jwt !== null) {
            this.state = {
                authenticated: true,
                redirected: false,
                serverResponse: null,
                fields: {},
                errors: {}
            }
        } else {
            this.state = {
                authenticated: false,
                redirected: false,
                serverResponse: null,
                fields: {},
                errors: {}
            }
        }
    }

    render() {
        const {t} = this.props;

        if(this.state.authenticated === true && this.jwt !== null) {
            return(
                <Redirect to=
                   {{ 
                        pathname: '/dashboard'
                   }} 
                />
            )
        } else {
            return(
                <section>
                    <hr /><h1 className="">{t('content.home.title')}</h1><hr />
                    
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempor nibh sed dolor lobortis sodales. Pellentesque diam nulla, pretium id nunc placerat, sagittis convallis metus. Duis ac blandit mauris, vitae dictum eros. In porta, leo sit amet euismod placerat, turpis mauris mollis felis, vel gravida ligula elit sed nisl. Quisque eros libero, viverra eget sem ac, dignissim volutpat ante. Nulla tincidunt lorem iaculis volutpat porta. Sed iaculis mattis risus eu ultricies. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    
    Vivamus pretium pretium metus a molestie. Integer ante libero, convallis ac aliquam volutpat, dignissim in sem. Pellentesque eget fringilla urna. Cras et facilisis sapien. Duis in justo eu mi eleifend congue. Proin vitae elit id dui dictum blandit a vel enim. Donec sagittis placerat ultricies. Mauris mi ante, facilisis eget rutrum pretium, fermentum malesuada tellus. Nulla sodales nibh ut urna suscipit, eu ullamcorper libero fringilla.
    
    Ut aliquam feugiat scelerisque. Vivamus iaculis tempor arcu a facilisis. Aenean lorem felis, mattis id lacus vel, feugiat fermentum eros. Morbi eu faucibus neque. Donec sit amet diam pharetra ligula semper egestas id ut leo. Phasellus blandit, nisi in egestas mattis, ligula elit sollicitudin tortor, sed laoreet ex enim id urna. Aliquam et lacinia eros. Sed interdum, nibh sit amet sodales bibendum, ipsum nulla elementum ligula, quis iaculis dolor ex ac purus.
    
    Integer eget blandit turpis, ac consectetur dui. Curabitur et scelerisque dui. Etiam dapibus, elit nec finibus pharetra, magna magna dapibus mi, nec dignissim elit ligula quis nunc. Vivamus fermentum gravida elementum. Proin vel vestibulum neque. Nullam at massa ut nisi fringilla ornare non sit amet quam. Phasellus cursus urna a ex porta, nec suscipit arcu tristique.
    
    Vivamus eu suscipit felis. Quisque mollis rutrum magna non facilisis. Pellentesque tincidunt mollis felis, at cursus lorem auctor tempus. Integer rutrum sed metus vel luctus. Quisque tempor lorem sapien, nec ultrices enim feugiat vel. Etiam non orci ut leo accumsan sollicitudin. Maecenas nulla sapien, tempus ut sem nec, fringilla laoreet lacus. Cras id lacus augue. Fusce et tellus vitae arcu pharetra aliquet a nec mi. Vivamus dictum, massa id imperdiet scelerisque, nisi risus scelerisque urna, id pulvinar orci diam ac tellus.
    
    Suspendisse nec venenatis neque. Integer eros sapien, dignissim a diam et, congue laoreet mi. Aenean ut sem diam. Aliquam placerat leo sit amet justo interdum finibus. Maecenas iaculis, ante eget euismod dignissim, nibh enim luctus risus, vitae venenatis mauris odio in ipsum. Aliquam a sapien sit amet dolor sollicitudin dignissim sed ultrices massa. In non lacinia quam. Maecenas maximus, leo nec volutpat ullamcorper, velit metus venenatis nibh, facilisis pharetra elit mauris vel velit. Morbi cursus libero at nunc suscipit, sit amet scelerisque nunc lobortis. Aliquam libero risus, semper sit amet faucibus nec, euismod non lectus. Suspendisse posuere, diam at varius condimentum, mauris tortor sagittis lacus, id pharetra lorem libero quis nulla. Maecenas placerat, ipsum eu sagittis elementum, eros massa fermentum tortor, non ullamcorper ipsum dolor eget tellus. Aliquam luctus tortor quis fringilla elementum. Suspendisse sit amet felis odio. Ut tincidunt finibus mauris in tincidunt. Vestibulum eleifend, nunc vitae feugiat feugiat, ligula dolor interdum neque, imperdiet gravida nunc dolor eu sem.
    
    Pellentesque sollicitudin consectetur sapien. Mauris tincidunt malesuada felis sodales pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus a neque vel ipsum tincidunt accumsan. Phasellus tempus massa at neque dignissim laoreet. Duis mattis ultrices magna vitae venenatis. Integer quam odio, eleifend et ante id, aliquam convallis magna. Vestibulum molestie lectus vel ligula malesuada, eget pretium nisl sodales. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec fermentum sem id luctus laoreet. Cras et iaculis dui. Curabitur scelerisque odio tortor, eu lacinia nulla congue id. Vestibulum eu porttitor odio.
    
    Nunc et justo arcu. Etiam condimentum ante varius metus pulvinar venenatis. Etiam fringilla nunc nec maximus commodo. Donec ac ultrices orci, at iaculis ante. Etiam lacinia nisl non varius pulvinar. Cras ultricies, orci id hendrerit vestibulum, turpis lacus commodo dui, vitae ultrices turpis lorem vitae risus. Proin congue urna at lectus dapibus malesuada. Phasellus ut massa lectus.
    
    Praesent a turpis nisi. Morbi ut dictum elit, at feugiat justo. Nunc sollicitudin tellus vitae interdum tristique. Quisque in gravida velit, quis iaculis justo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi nec sapien nec magna mattis fringilla in a mauris. Sed placerat ultricies diam. Vestibulum neque tortor, volutpat sed sollicitudin vitae, hendrerit a velit. Pellentesque aliquet ex sed est aliquam, ac congue justo maximus. Pellentesque consequat at mi in egestas. Proin feugiat eget sem eget consequat. Quisque a nisl nec nulla cursus auctor.
    
    Nam et velit mi. Sed et augue feugiat, placerat dolor a, placerat leo. Aliquam bibendum commodo sem, et consequat diam porttitor ut. In ornare aliquam pellentesque. Mauris euismod dignissim nisl, ac ultricies urna porta sit amet. In vestibulum urna at sem pulvinar blandit. Nunc tincidunt nunc vel metus congue semper. Sed pellentesque, mi at tristique porttitor, neque justo congue urna, ut mattis orci lacus nec lectus. Nulla vel enim id libero iaculis malesuada. Fusce massa massa, porta a rhoncus a, aliquet eu nisl. Aliquam velit justo, pellentesque dictum tempus id, tincidunt nec risus. Donec varius dui id justo malesuada, sit amet consectetur risus suscipit. Aliquam quis ipsum a sapien dapibus scelerisque in quis magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac lobortis nisi. 
    
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempor nibh sed dolor lobortis sodales. Pellentesque diam nulla, pretium id nunc placerat, sagittis convallis metus. Duis ac blandit mauris, vitae dictum eros. In porta, leo sit amet euismod placerat, turpis mauris mollis felis, vel gravida ligula elit sed nisl. Quisque eros libero, viverra eget sem ac, dignissim volutpat ante. Nulla tincidunt lorem iaculis volutpat porta. Sed iaculis mattis risus eu ultricies. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    
    Vivamus pretium pretium metus a molestie. Integer ante libero, convallis ac aliquam volutpat, dignissim in sem. Pellentesque eget fringilla urna. Cras et facilisis sapien. Duis in justo eu mi eleifend congue. Proin vitae elit id dui dictum blandit a vel enim. Donec sagittis placerat ultricies. Mauris mi ante, facilisis eget rutrum pretium, fermentum malesuada tellus. Nulla sodales nibh ut urna suscipit, eu ullamcorper libero fringilla.
    
    Ut aliquam feugiat scelerisque. Vivamus iaculis tempor arcu a facilisis. Aenean lorem felis, mattis id lacus vel, feugiat fermentum eros. Morbi eu faucibus neque. Donec sit amet diam pharetra ligula semper egestas id ut leo. Phasellus blandit, nisi in egestas mattis, ligula elit sollicitudin tortor, sed laoreet ex enim id urna. Aliquam et lacinia eros. Sed interdum, nibh sit amet sodales bibendum, ipsum nulla elementum ligula, quis iaculis dolor ex ac purus.
    
    Integer eget blandit turpis, ac consectetur dui. Curabitur et scelerisque dui. Etiam dapibus, elit nec finibus pharetra, magna magna dapibus mi, nec dignissim elit ligula quis nunc. Vivamus fermentum gravida elementum. Proin vel vestibulum neque. Nullam at massa ut nisi fringilla ornare non sit amet quam. Phasellus cursus urna a ex porta, nec suscipit arcu tristique.
    
    Vivamus eu suscipit felis. Quisque mollis rutrum magna non facilisis. Pellentesque tincidunt mollis felis, at cursus lorem auctor tempus. Integer rutrum sed metus vel luctus. Quisque tempor lorem sapien, nec ultrices enim feugiat vel. Etiam non orci ut leo accumsan sollicitudin. Maecenas nulla sapien, tempus ut sem nec, fringilla laoreet lacus. Cras id lacus augue. Fusce et tellus vitae arcu pharetra aliquet a nec mi. Vivamus dictum, massa id imperdiet scelerisque, nisi risus scelerisque urna, id pulvinar orci diam ac tellus.
    
    Suspendisse nec venenatis neque. Integer eros sapien, dignissim a diam et, congue laoreet mi. Aenean ut sem diam. Aliquam placerat leo sit amet justo interdum finibus. Maecenas iaculis, ante eget euismod dignissim, nibh enim luctus risus, vitae venenatis mauris odio in ipsum. Aliquam a sapien sit amet dolor sollicitudin dignissim sed ultrices massa. In non lacinia quam. Maecenas maximus, leo nec volutpat ullamcorper, velit metus venenatis nibh, facilisis pharetra elit mauris vel velit. Morbi cursus libero at nunc suscipit, sit amet scelerisque nunc lobortis. Aliquam libero risus, semper sit amet faucibus nec, euismod non lectus. Suspendisse posuere, diam at varius condimentum, mauris tortor sagittis lacus, id pharetra lorem libero quis nulla. Maecenas placerat, ipsum eu sagittis elementum, eros massa fermentum tortor, non ullamcorper ipsum dolor eget tellus. Aliquam luctus tortor quis fringilla elementum. Suspendisse sit amet felis odio. Ut tincidunt finibus mauris in tincidunt. Vestibulum eleifend, nunc vitae feugiat feugiat, ligula dolor interdum neque, imperdiet gravida nunc dolor eu sem.
    
    Pellentesque sollicitudin consectetur sapien. Mauris tincidunt malesuada felis sodales pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus a neque vel ipsum tincidunt accumsan. Phasellus tempus massa at neque dignissim laoreet. Duis mattis ultrices magna vitae venenatis. Integer quam odio, eleifend et ante id, aliquam convallis magna. Vestibulum molestie lectus vel ligula malesuada, eget pretium nisl sodales. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec fermentum sem id luctus laoreet. Cras et iaculis dui. Curabitur scelerisque odio tortor, eu lacinia nulla congue id. Vestibulum eu porttitor odio.
    
    Nunc et justo arcu. Etiam condimentum ante varius metus pulvinar venenatis. Etiam fringilla nunc nec maximus commodo. Donec ac ultrices orci, at iaculis ante. Etiam lacinia nisl non varius pulvinar. Cras ultricies, orci id hendrerit vestibulum, turpis lacus commodo dui, vitae ultrices turpis lorem vitae risus. Proin congue urna at lectus dapibus malesuada. Phasellus ut massa lectus.
    
    Praesent a turpis nisi. Morbi ut dictum elit, at feugiat justo. Nunc sollicitudin tellus vitae interdum tristique. Quisque in gravida velit, quis iaculis justo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi nec sapien nec magna mattis fringilla in a mauris. Sed placerat ultricies diam. Vestibulum neque tortor, volutpat sed sollicitudin vitae, hendrerit a velit. Pellentesque aliquet ex sed est aliquam, ac congue justo maximus. Pellentesque consequat at mi in egestas. Proin feugiat eget sem eget consequat. Quisque a nisl nec nulla cursus auctor.
    
    Nam et velit mi. Sed et augue feugiat, placerat dolor a, placerat leo. Aliquam bibendum commodo sem, et consequat diam porttitor ut. In ornare aliquam pellentesque. Mauris euismod dignissim nisl, ac ultricies urna porta sit amet. In vestibulum urna at sem pulvinar blandit. Nunc tincidunt nunc vel metus congue semper. Sed pellentesque, mi at tristique porttitor, neque justo congue urna, ut mattis orci lacus nec lectus. Nulla vel enim id libero iaculis malesuada. Fusce massa massa, porta a rhoncus a, aliquet eu nisl. Aliquam velit justo, pellentesque dictum tempus id, tincidunt nec risus. Donec varius dui id justo malesuada, sit amet consectetur risus suscipit. Aliquam quis ipsum a sapien dapibus scelerisque in quis magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac lobortis nisi. 
    
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempor nibh sed dolor lobortis sodales. Pellentesque diam nulla, pretium id nunc placerat, sagittis convallis metus. Duis ac blandit mauris, vitae dictum eros. In porta, leo sit amet euismod placerat, turpis mauris mollis felis, vel gravida ligula elit sed nisl. Quisque eros libero, viverra eget sem ac, dignissim volutpat ante. Nulla tincidunt lorem iaculis volutpat porta. Sed iaculis mattis risus eu ultricies. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    
    Vivamus pretium pretium metus a molestie. Integer ante libero, convallis ac aliquam volutpat, dignissim in sem. Pellentesque eget fringilla urna. Cras et facilisis sapien. Duis in justo eu mi eleifend congue. Proin vitae elit id dui dictum blandit a vel enim. Donec sagittis placerat ultricies. Mauris mi ante, facilisis eget rutrum pretium, fermentum malesuada tellus. Nulla sodales nibh ut urna suscipit, eu ullamcorper libero fringilla.
    
    Ut aliquam feugiat scelerisque. Vivamus iaculis tempor arcu a facilisis. Aenean lorem felis, mattis id lacus vel, feugiat fermentum eros. Morbi eu faucibus neque. Donec sit amet diam pharetra ligula semper egestas id ut leo. Phasellus blandit, nisi in egestas mattis, ligula elit sollicitudin tortor, sed laoreet ex enim id urna. Aliquam et lacinia eros. Sed interdum, nibh sit amet sodales bibendum, ipsum nulla elementum ligula, quis iaculis dolor ex ac purus.
    
    Integer eget blandit turpis, ac consectetur dui. Curabitur et scelerisque dui. Etiam dapibus, elit nec finibus pharetra, magna magna dapibus mi, nec dignissim elit ligula quis nunc. Vivamus fermentum gravida elementum. Proin vel vestibulum neque. Nullam at massa ut nisi fringilla ornare non sit amet quam. Phasellus cursus urna a ex porta, nec suscipit arcu tristique.
    
    Vivamus eu suscipit felis. Quisque mollis rutrum magna non facilisis. Pellentesque tincidunt mollis felis, at cursus lorem auctor tempus. Integer rutrum sed metus vel luctus. Quisque tempor lorem sapien, nec ultrices enim feugiat vel. Etiam non orci ut leo accumsan sollicitudin. Maecenas nulla sapien, tempus ut sem nec, fringilla laoreet lacus. Cras id lacus augue. Fusce et tellus vitae arcu pharetra aliquet a nec mi. Vivamus dictum, massa id imperdiet scelerisque, nisi risus scelerisque urna, id pulvinar orci diam ac tellus.
    
    Suspendisse nec venenatis neque. Integer eros sapien, dignissim a diam et, congue laoreet mi. Aenean ut sem diam. Aliquam placerat leo sit amet justo interdum finibus. Maecenas iaculis, ante eget euismod dignissim, nibh enim luctus risus, vitae venenatis mauris odio in ipsum. Aliquam a sapien sit amet dolor sollicitudin dignissim sed ultrices massa. In non lacinia quam. Maecenas maximus, leo nec volutpat ullamcorper, velit metus venenatis nibh, facilisis pharetra elit mauris vel velit. Morbi cursus libero at nunc suscipit, sit amet scelerisque nunc lobortis. Aliquam libero risus, semper sit amet faucibus nec, euismod non lectus. Suspendisse posuere, diam at varius condimentum, mauris tortor sagittis lacus, id pharetra lorem libero quis nulla. Maecenas placerat, ipsum eu sagittis elementum, eros massa fermentum tortor, non ullamcorper ipsum dolor eget tellus. Aliquam luctus tortor quis fringilla elementum. Suspendisse sit amet felis odio. Ut tincidunt finibus mauris in tincidunt. Vestibulum eleifend, nunc vitae feugiat feugiat, ligula dolor interdum neque, imperdiet gravida nunc dolor eu sem.
    
    Pellentesque sollicitudin consectetur sapien. Mauris tincidunt malesuada felis sodales pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus a neque vel ipsum tincidunt accumsan. Phasellus tempus massa at neque dignissim laoreet. Duis mattis ultrices magna vitae venenatis. Integer quam odio, eleifend et ante id, aliquam convallis magna. Vestibulum molestie lectus vel ligula malesuada, eget pretium nisl sodales. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec fermentum sem id luctus laoreet. Cras et iaculis dui. Curabitur scelerisque odio tortor, eu lacinia nulla congue id. Vestibulum eu porttitor odio.
    
    Nunc et justo arcu. Etiam condimentum ante varius metus pulvinar venenatis. Etiam fringilla nunc nec maximus commodo. Donec ac ultrices orci, at iaculis ante. Etiam lacinia nisl non varius pulvinar. Cras ultricies, orci id hendrerit vestibulum, turpis lacus commodo dui, vitae ultrices turpis lorem vitae risus. Proin congue urna at lectus dapibus malesuada. Phasellus ut massa lectus.
    
    Praesent a turpis nisi. Morbi ut dictum elit, at feugiat justo. Nunc sollicitudin tellus vitae interdum tristique. Quisque in gravida velit, quis iaculis justo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi nec sapien nec magna mattis fringilla in a mauris. Sed placerat ultricies diam. Vestibulum neque tortor, volutpat sed sollicitudin vitae, hendrerit a velit. Pellentesque aliquet ex sed est aliquam, ac congue justo maximus. Pellentesque consequat at mi in egestas. Proin feugiat eget sem eget consequat. Quisque a nisl nec nulla cursus auctor.
    
    Nam et velit mi. Sed et augue feugiat, placerat dolor a, placerat leo. Aliquam bibendum commodo sem, et consequat diam porttitor ut. In ornare aliquam pellentesque. Mauris euismod dignissim nisl, ac ultricies urna porta sit amet. In vestibulum urna at sem pulvinar blandit. Nunc tincidunt nunc vel metus congue semper. Sed pellentesque, mi at tristique porttitor, neque justo congue urna, ut mattis orci lacus nec lectus. Nulla vel enim id libero iaculis malesuada. Fusce massa massa, porta a rhoncus a, aliquet eu nisl. Aliquam velit justo, pellentesque dictum tempus id, tincidunt nec risus. Donec varius dui id justo malesuada, sit amet consectetur risus suscipit. Aliquam quis ipsum a sapien dapibus scelerisque in quis magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac lobortis nisi. 
    
    
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempor nibh sed dolor lobortis sodales. Pellentesque diam nulla, pretium id nunc placerat, sagittis convallis metus. Duis ac blandit mauris, vitae dictum eros. In porta, leo sit amet euismod placerat, turpis mauris mollis felis, vel gravida ligula elit sed nisl. Quisque eros libero, viverra eget sem ac, dignissim volutpat ante. Nulla tincidunt lorem iaculis volutpat porta. Sed iaculis mattis risus eu ultricies. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    
    Vivamus pretium pretium metus a molestie. Integer ante libero, convallis ac aliquam volutpat, dignissim in sem. Pellentesque eget fringilla urna. Cras et facilisis sapien. Duis in justo eu mi eleifend congue. Proin vitae elit id dui dictum blandit a vel enim. Donec sagittis placerat ultricies. Mauris mi ante, facilisis eget rutrum pretium, fermentum malesuada tellus. Nulla sodales nibh ut urna suscipit, eu ullamcorper libero fringilla.
    
    Ut aliquam feugiat scelerisque. Vivamus iaculis tempor arcu a facilisis. Aenean lorem felis, mattis id lacus vel, feugiat fermentum eros. Morbi eu faucibus neque. Donec sit amet diam pharetra ligula semper egestas id ut leo. Phasellus blandit, nisi in egestas mattis, ligula elit sollicitudin tortor, sed laoreet ex enim id urna. Aliquam et lacinia eros. Sed interdum, nibh sit amet sodales bibendum, ipsum nulla elementum ligula, quis iaculis dolor ex ac purus.
    
    Integer eget blandit turpis, ac consectetur dui. Curabitur et scelerisque dui. Etiam dapibus, elit nec finibus pharetra, magna magna dapibus mi, nec dignissim elit ligula quis nunc. Vivamus fermentum gravida elementum. Proin vel vestibulum neque. Nullam at massa ut nisi fringilla ornare non sit amet quam. Phasellus cursus urna a ex porta, nec suscipit arcu tristique.
    
    Vivamus eu suscipit felis. Quisque mollis rutrum magna non facilisis. Pellentesque tincidunt mollis felis, at cursus lorem auctor tempus. Integer rutrum sed metus vel luctus. Quisque tempor lorem sapien, nec ultrices enim feugiat vel. Etiam non orci ut leo accumsan sollicitudin. Maecenas nulla sapien, tempus ut sem nec, fringilla laoreet lacus. Cras id lacus augue. Fusce et tellus vitae arcu pharetra aliquet a nec mi. Vivamus dictum, massa id imperdiet scelerisque, nisi risus scelerisque urna, id pulvinar orci diam ac tellus.
    
    Suspendisse nec venenatis neque. Integer eros sapien, dignissim a diam et, congue laoreet mi. Aenean ut sem diam. Aliquam placerat leo sit amet justo interdum finibus. Maecenas iaculis, ante eget euismod dignissim, nibh enim luctus risus, vitae venenatis mauris odio in ipsum. Aliquam a sapien sit amet dolor sollicitudin dignissim sed ultrices massa. In non lacinia quam. Maecenas maximus, leo nec volutpat ullamcorper, velit metus venenatis nibh, facilisis pharetra elit mauris vel velit. Morbi cursus libero at nunc suscipit, sit amet scelerisque nunc lobortis. Aliquam libero risus, semper sit amet faucibus nec, euismod non lectus. Suspendisse posuere, diam at varius condimentum, mauris tortor sagittis lacus, id pharetra lorem libero quis nulla. Maecenas placerat, ipsum eu sagittis elementum, eros massa fermentum tortor, non ullamcorper ipsum dolor eget tellus. Aliquam luctus tortor quis fringilla elementum. Suspendisse sit amet felis odio. Ut tincidunt finibus mauris in tincidunt. Vestibulum eleifend, nunc vitae feugiat feugiat, ligula dolor interdum neque, imperdiet gravida nunc dolor eu sem.
    
    Pellentesque sollicitudin consectetur sapien. Mauris tincidunt malesuada felis sodales pellentesque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus a neque vel ipsum tincidunt accumsan. Phasellus tempus massa at neque dignissim laoreet. Duis mattis ultrices magna vitae venenatis. Integer quam odio, eleifend et ante id, aliquam convallis magna. Vestibulum molestie lectus vel ligula malesuada, eget pretium nisl sodales. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec fermentum sem id luctus laoreet. Cras et iaculis dui. Curabitur scelerisque odio tortor, eu lacinia nulla congue id. Vestibulum eu porttitor odio.
    
    Nunc et justo arcu. Etiam condimentum ante varius metus pulvinar venenatis. Etiam fringilla nunc nec maximus commodo. Donec ac ultrices orci, at iaculis ante. Etiam lacinia nisl non varius pulvinar. Cras ultricies, orci id hendrerit vestibulum, turpis lacus commodo dui, vitae ultrices turpis lorem vitae risus. Proin congue urna at lectus dapibus malesuada. Phasellus ut massa lectus.
    
    Praesent a turpis nisi. Morbi ut dictum elit, at feugiat justo. Nunc sollicitudin tellus vitae interdum tristique. Quisque in gravida velit, quis iaculis justo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi nec sapien nec magna mattis fringilla in a mauris. Sed placerat ultricies diam. Vestibulum neque tortor, volutpat sed sollicitudin vitae, hendrerit a velit. Pellentesque aliquet ex sed est aliquam, ac congue justo maximus. Pellentesque consequat at mi in egestas. Proin feugiat eget sem eget consequat. Quisque a nisl nec nulla cursus auctor.
    
    Nam et velit mi. Sed et augue feugiat, placerat dolor a, placerat leo. Aliquam bibendum commodo sem, et consequat diam porttitor ut. In ornare aliquam pellentesque. Mauris euismod dignissim nisl, ac ultricies urna porta sit amet. In vestibulum urna at sem pulvinar blandit. Nunc tincidunt nunc vel metus congue semper. Sed pellentesque, mi at tristique porttitor, neque justo congue urna, ut mattis orci lacus nec lectus. Nulla vel enim id libero iaculis malesuada. Fusce massa massa, porta a rhoncus a, aliquet eu nisl. Aliquam velit justo, pellentesque dictum tempus id, tincidunt nec risus. Donec varius dui id justo malesuada, sit amet consectetur risus suscipit. Aliquam quis ipsum a sapien dapibus scelerisque in quis magna. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ac lobortis nisi. 
                </section>
            )
        }    
        }
}

const HomeTranslation = withTranslation('common')(Home);

export default HomeTranslation;