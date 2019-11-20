function createNavBar() {
    $(".navbar").append(`
    <a class="navbar-brand" href="#">
        <img src="https://i.imgur.com/U7a9HzK.png" width="30" height="30" class="d-inline-block align-top"
            alt="">
        MatchdayPool
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item active">
                <a class="nav-link" href="index.html">Home <span class="sr-only">(current)</span></a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="publicPools.html">Public Pools</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="publicPools.html">My Pools</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="publicPools.html">Create a pool</a>
            </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2" type="search" placeholder="Search for a pool" aria-label="Search">
            <button class="btn btn-outline-info my-2 my-sm-0" type="submit">Search</button>
        </form>
        <a class="nav-link" href="login.html"><button class="btn btn-outline-danger my-2 my-sm-0" type="submit">Log In / Sign Up</button></a>
        <div class="dropdown">
            <button class="btn btn-danger dropdown-toggle my-2 my-sm-0" type="button" id="dropdownMenuButton" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false"><img src="./assets/portrait.png" width="30" height="30" class="d-inline-block align-top" alt="">
                Username
            </button>
            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="#"><img src="assets/account.png"> Profile</a>
                <a class="dropdown-item" href="#"><img src="assets/edit.png"> Edit information</a>
                <a class="dropdown-item" href="#"><img src="assets/invitations.png"> Invitations</a>
                <a class="dropdown-item signOut" href="#"><img src="assets/Redsignout.png"> Sign out</a>
            </div>
        </div>
    </div>
    `);
}

createNavBar()