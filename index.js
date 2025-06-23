const fs = require('node:fs');
const path = require('node:path');
const { abort } = require('node:process');
const colors = require('yoctocolors-cjs');
const userCommand = process.argv[2];
const userArgument1 = process.argv[3];
const userArgument2 = process.argv[4];
//userCommand should only be reserved for system commanding operations, For eg. mkdir, rmdir,rmfile,mkfile,
//userArgument should usually be file names or directory names on which userCommand operation apply.

		// const availableCommands = ['check','frelative','mkfile','cpfileto','','',''];
		// availableCommands.forEach(element => {
		// if(userCommand!==element){
		// 	console.log(colors.red('Invalid Command. Refer to Docs https://www.docs.fsmanager.com or Type fsmanager show-commands or fsmanager --help'));
		// 	abort;
		// }
		// });

	function help(userArgument1){
		const helpObj = {
			check:" To check the accessibility of file(s)",
			cat:" To Read file's content in read stream",
			ls:" To list all files, folders in a directory",
			stats:" To show related stats",
			cpto:" Copy directory with its content to another directory",
			cpfileto:" Copy file's content to another new file",
			chmod:" Change permission of file",
			check:" Check permission of files",
			unlink:" Delete specific file",
			frelative:" To show the relations between dir or file",
			rmdir:" Remove Dir with all its content",
			rmfile:" Remove file recursively",
			find:" Find file path",
			mkfile:"Make file with initial content",
			help:"Help | Show all commands"
		}
		console.log('\n\n');
		console.log(colors.yellow("\t\tHelp Docs | Showing all commands"));
		console.log(colors.yellow("\t\t----------------------------------"));
		console.log(colors.yellow(`
		check	| ${helpObj.check} \t \n\t\tfsmanager check [filename]\n
		cat	| ${helpObj.cat} \t \n\t\tfsmanager cat [filename]\n
		ls	| ${helpObj.ls} \t \n\t\tfsmanager ls [dir]\n
		stats	| ${helpObj.stats} \t \n\t\tfsmanager stats [filename/dir]\n
		cpto	| ${helpObj.cpto} \t \n\t\tfsmanager cpto [dir1] [dir2]\n
		cpfileto| ${helpObj.cpfileto} \t \n\t\tfsmanager cpfileto [file1]\n
		chmod	| ${helpObj.chmod} \t \n\t\tfsmanager chmod [file]\n
		unlink	| ${helpObj.unlink} \t \n\t\tfsmanager unlink [file1]\n
		frelative| ${helpObj.frelative} \t \n\t\tfsmanager frelative [file1] [file2]\n
		rmdir	| ${helpObj.rmdir} \t \n\t\tfsmanager rmdir [dir]\n
		rmfile	| ${helpObj.rmfile} \t \n\t\tfsmanager rmfile [filename]\n
		find	| ${helpObj.find} \t \n\t\tfsmanager find [filename]\n
		mkfile	| ${helpObj.mkfile} \t \n\t\tfsmanager mkfile [filename] [Initial content]\n
		`));
	}


	function closeFd(fd){
		fs.close(fd,(err)=>{
			if(err) throw err;
		})
	}
	function check(userArgument1,userArgument2){
		if(userArgument2==='isExist'){
		fs.access(userArgument1,fs.constants.F_OK,(err)=>{
		 console.log(`${userArgument1} ${err ? colors.red('does not exist with return value -1'):colors.green('exist')}`);	
		 })
		 abort;
		}
		else if(userArgument2==='isRead'){
		fs.access(userArgument1,fs.constants.R_OK,(err)=>{
		 console.log(`${userArgument1} ${err ? colors.red('does not readable with return value -1'):colors.green('readable')}`);	
		 })
		}
		else if(userArgument2==='isWrite'){
		fs.access(userArgument1,fs.constants.W_OK,(err)=>{
		 console.log(`${userArgument1} ${err ? colors.red('does not writable with return value -1'):colors.green('writable')}`);	
		 })
		}
		else if(userArgument2==='isExec'){
		fs.access(userArgument1,fs.constants.X_OK,(err)=>{
		 console.log(`${userArgument1} ${err ? colors.red('does not executable with return value -1'):colors.green('executable')}`);	
		 })
		}
	}
	function fRelative(userArgument1,userArgument2){
		console.log(`File provided ${path.relative(userArgument1,userArgument2)}`);
	}

	function mkfile(userArgument1,userArgument2){
	fs.open(userArgument1,'w',(err,fd)=>{
		if(err){
			if(err.code === 'EEXIST'){
				console.log(colors.red('File already exist'));
				return;
			}
			throw err;
	}

    try{
        fs.writeFile(fd,userArgument2,'utf8',(err)=>{
            console.log(colors.green("File written successfully"))
            if (err) throw err;
        });
    }
    finally{
        fs.close(fd,(err)=>{
            if(err) throw err;
        });
    }
})
	}

	function changePermission(userArgument1,userArgument2){
		fs.chmod(userArgument1,Number(userArgument2),(err)=>{
			if(err) console.log(colors.red(err.message));
			console.log(colors.green('The permissions for file "my_file.txt" have been changed!'));
		})
	}

	function cpyFile(src,dest){
		fs.copyFile(src,dest,(err)=>{
			console.log(colors.green(`Copied Successfully to ${dest}`));
			if (err) throw err;
		})
	}
	function cpto(src,dest){
		fs.cp(src,dest,{force:true,recursive: true},(err)=>{
			if(err) throw err;
			console.log(colors.green("Successfully copied to" + dest));
		})
	}
	function find(keyword){
	fs.glob(keyword, (err, matches) => {
	if (err) throw err;
	console.log(colors.green(matches));
	});
	}
	function rmFile(file){
	fs.rm(file,{force:true,recursive:true}, (err) => {
	if (err) throw err;
	console.log(colors.green("File Removed successfully"));
	});
	}
	function unlink(file){
		fs.unlink(file, (err) => {
		if (err) throw err;
		console.log(colors.green(`${file} was deleted`));
		});
	}
	function rmDir(dir){
	fs.rm(dir,{force:true,recursive:true}, (err) => {
	if (err) throw err;
	console.log(colors.green("Directory(ies) Removed successfully"));
	});
	}
	function stats(userArgument1){
	fs.open(userArgument1, 'r', (err, fd) => {
	try {
		fs.stat(userArgument1, (err, stats) => {
		if (err) {
			console.error(colors.red('Error getting file stats:', err));
			return;
		}
		console.log(colors.green(`File size in bytes: ${stats}`));
	});
	} finally {
		fs.close(fd, (err) => {
		if (err) throw err;
		});
	}
	}); 
}
	function ls(userArgument1){
		fs.readdir(userArgument1,'utf8', (err, files) => {
		if (err) throw err;
		console.log(colors.green(files + '\n'));
		}); 
	}
	function cat(userArgument1){

		fs.readFile(userArgument1,'utf8', (err, data) => {
		if (err) throw err;
		console.log(colors.green(data));
		}); 
	}

	function run(userCommand){
		if(userCommand === 'mkfile'){
			mkfile(userArgument1,userArgument2);
		}
		else if(userCommand === 'find'){
			find(userArgument1);
		}

		else if(userCommand === 'rmfile'){
			rmFile(userArgument1);
		}
		else if(userCommand === 'rmdir'){
			rmDir(userArgument1);
		}

		else if(userCommand === 'frelative'){
			fRelative(userArgument1,userArgument2);
		}
		
		else if(userCommand === 'unlink'){
			unlink(userArgument1);
		}

		else if(userCommand === 'check')
		{
			check(userArgument1,userArgument2);
		}
		else if(userCommand ==='chmod'){
			changePermission(userArgument1,userArgument2);
		}
		else if(userCommand === 'cpfileto'){
			cpyFile(userArgument1,userArgument2);
		}
		else if(userCommand === 'cpto'){
			cpto(userArgument1,userArgument2);
		}
		else if(userCommand === 'stats'){
			stats(userArgument1)
		}
		else if(userCommand === 'ls'){
			ls(userArgument1)
		}
		else if(userCommand === 'cat'){
			cat(userArgument1);
		}
		else if(userCommand === 'help'){
			help(userArgument1)
		}
		else{
			console.log(colors.red(`${userCommand} is an Invalid Command. Refer to Docs https://www.docs.fsmanager.com or Type fsmanager show-commands or fsmanager --help`));
		}
	}

	run(userCommand);
