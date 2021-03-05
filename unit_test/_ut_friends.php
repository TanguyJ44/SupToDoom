<?php
use PHPUnit\Framework\TestCase;

class FriendTest extends Friends
{
    public function tests()
    {
        $this->assertSame('[json]', count(getUserFriends()));
        $this->assertSame('success', count(searchUserFriend()));
        $this->assertSame('error', count(searchUserFriend()));
        $this->assertSame('MichMich', count(getUserPseudo(1)));
    }
}

?>