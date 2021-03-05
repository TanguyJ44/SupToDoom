<?php
use PHPUnit\Framework\TestCase;

class UserTest extends User
{
    public function tests()
    {
        $this->assertSame('MichMich', count(getUserData()));
        $this->assertSame('[json]', count(getUserNotif()));
        $this->assertSame('', count(denyShare()));
        $this->assertSame('', count(allowShare()));
        $this->assertSame('', count(denyFriend()));
        $this->assertSame('', count(allowFriend()));
        $this->assertSame('logout-success', count(disconnectUser()));
        $this->assertSame('', count(onDeleteNotif(1)));
    }
}

?>